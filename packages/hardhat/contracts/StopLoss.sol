// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IPriceOracle.sol";
import "./interfaces/IERC20.sol";
import "./libraries/TransferHelper.sol";

contract StopLoss is Initializable, AccessControlUpgradeable {
	bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

	uint256 public constant PERCENT_DIVISOR = 10000;

	enum OrderStatus {
		None,
		Active,
		Canceled,
		Executed
	}

	enum OrderType {
		None,
		Market,
		Limit,
		StopLoss,
		TrailingStop
	}

	struct Order {
		OrderStatus orderStatus;
		OrderType orderType;
		address buyer;
		uint16 triggerPercent;
		uint128 sellAmount;
		uint128 buyAmount;
		uint128 sellToComplete;
		uint128 buyToComplete;
	}

	IPriceOracle public priceOracle;
	uint256 public stopLossMinimal;

	// sell token, buy token, orders
	mapping(address => mapping(address => Order[])) public orders;

	error NotAContract();
	error IncompatibleToken();
	error OrderNotActive();
	error TriggerToHigh();

	function initialize(address _priceOracle) public initializer {
		if (!_isContract(_priceOracle)) {
			revert NotAContract();
		}

		__AccessControl_init();

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(CONTROLLER_ROLE, msg.sender);

		priceOracle = IPriceOracle(_priceOracle);
		stopLossMinimal = 100; // 1% due to price oracle deviation
	}

	function updatePriceOracle(
		address _priceOracle
	) external onlyRole(CONTROLLER_ROLE) {
		if (!_isContract(_priceOracle)) {
			revert NotAContract();
		}

		priceOracle = IPriceOracle(_priceOracle);
	}

	function addStopLoss(
		address sellToken,
		address buyToken,
		uint128 sellAmount,
		uint128 buyAmount,
		uint16 triggerPercent
	) external {
		if (!priceOracle.exist(sellToken) || !priceOracle.exist(buyToken)) {
			revert IncompatibleToken();
		}

		if (triggerPercent < stopLossMinimal) {
			revert TriggerToHigh();
		}

		TransferHelper.safeTransferFrom(
			IERC20(sellToken),
			msg.sender,
			address(this),
			sellAmount
		);

		Order memory order = Order(
			OrderStatus.Active,
			OrderType.StopLoss,
			msg.sender,
			triggerPercent,
			sellAmount,
			buyAmount,
			sellAmount,
			buyAmount
		);

		orders[sellToken][buyToken].push(order);
	}

	function canExecuteOrder(
		address sellToken,
		address buyToken,
		uint256 indexOrder
	) public view returns (bool can) {
		Order memory order = orders[sellToken][buyToken][indexOrder];

		if (order.orderStatus != OrderStatus.Active) {
			revert OrderNotActive();
		}

		// support only stop loss actually
		if (order.orderType == OrderType.StopLoss) {
			(uint256 price, uint256 decimals) = priceOracle
				.getAssetPriceRelativeTo(sellToken, buyToken);

			uint8 decimalsSell = IERC20(sellToken).decimals();
			uint8 decimalsBuy = IERC20(buyToken).decimals();
			uint256 buyPrice = (uint256(order.sellAmount) * 10 ** decimalsBuy) /
				uint256(order.buyAmount);

			uint256 triggerAmount = buyPrice +
				((buyPrice * order.triggerPercent) / PERCENT_DIVISOR);

			can = (triggerAmount * decimals) <= (price * decimalsSell);
		}
	}

	function _isContract(address addr) private view returns (bool) {
		uint256 size;
		assembly {
			size := extcodesize(addr)
		}
		return size > 0;
	}
}
