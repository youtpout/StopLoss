// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IPriceOracle.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IWETH.sol";
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
	IWETH public WETH;

	// sell token, buy token, orders
	mapping(address => mapping(address => Order[])) public orders;

	event Add(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 index,
		Order order
	);

	event Executed(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 indexA,
		uint256 indexB,
		Order orderA,
		Order orderB
	);

	error NotAContract();
	error IncompatibleToken();
	error OrderNotActive();
	error TriggerToHigh();
	error NotSupported();
	error CantExecuteOrderA();
	error CantExecuteOrderB();
	error InvalidToken();
	error CantDepositETH();

	function initialize(
		address _priceOracle,
		address _WETH
	) public initializer {
		if (!_isContract(_priceOracle) || !_isContract(_WETH)) {
			revert NotAContract();
		}

		__AccessControl_init();

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(CONTROLLER_ROLE, msg.sender);

		priceOracle = IPriceOracle(_priceOracle);
		WETH = IWETH(WETH);
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

	function addOrder(
		OrderType orderType,
		address sellToken,
		address buyToken,
		uint128 sellAmount,
		uint128 buyAmount,
		uint16 triggerPercent
	) external payable {
		if (
			!_isContract(sellToken) ||
			!_isContract(buyToken) ||
			sellToken == buyToken
		) {
			revert InvalidToken();
		}

		if (
			msg.value > 0 &&
			(sellToken != address(WETH) || sellAmount != msg.value)
		) {
			revert CantDepositETH();
		}

		if (orderType != OrderType.StopLoss && orderType != OrderType.Limit) {
			revert NotSupported();
		}

		if (
			orderType == OrderType.StopLoss && triggerPercent < stopLossMinimal
		) {
			revert TriggerToHigh();
		}

		if (
			(orderType == OrderType.StopLoss &&
				!priceOracle.exist(sellToken)) || !priceOracle.exist(buyToken)
		) {
			revert IncompatibleToken();
		}

		if (msg.value > 0) {
			WETH.deposit();
		} else {
			TransferHelper.safeTransferFrom(
				IERC20(sellToken),
				msg.sender,
				address(this),
				sellAmount
			);
		}

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

		uint256 index = orders[sellToken][buyToken].length;

		orders[sellToken][buyToken].push(order);

		emit Add(msg.sender, sellToken, buyToken, index, order);
	}

	function executeOrder(
		address sellToken,
		address buyToken,
		uint256 indexA,
		uint256 indexB
	) external {
		Order storage orderA = orders[sellToken][buyToken][indexA];
		if (!_canExecuteOrder(sellToken, buyToken, orderA)) {
			revert CantExecuteOrderA();
		}
		Order storage orderB = orders[buyToken][sellToken][indexB];
		if (!_canExecuteOrder(buyToken, sellToken, orderB)) {
			revert CantExecuteOrderB();
		}

		emit Executed(
			msg.sender,
			sellToken,
			buyToken,
			indexA,
			indexB,
			orderA,
			orderB
		);
	}

	function canExecuteOrder(
		address sellToken,
		address buyToken,
		uint256 indexOrder
	) external view returns (bool) {
		Order memory order = orders[sellToken][buyToken][indexOrder];
		return _canExecuteOrder(sellToken, buyToken, order);
	}

	function _canExecuteOrder(
		address sellToken,
		address buyToken,
		Order memory order
	) private view returns (bool can) {
		if (order.orderStatus != OrderStatus.Active) {
			revert OrderNotActive();
		}

		// support only stop loss and limit actually
		if (order.orderType == OrderType.Limit) {
			can = true;
		} else if (order.orderType == OrderType.StopLoss) {
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
