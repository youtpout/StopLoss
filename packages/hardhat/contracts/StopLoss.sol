// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IPriceOracle.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IWETH.sol";
import "./libraries/TransferHelper.sol";

import { console } from "forge-std/console.sol";

contract StopLoss is Initializable, AccessControlUpgradeable {
	bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");
	uint256 public constant PERCENT_DIVISOR = 10_000;
	uint256 public constant PRICE_DECIMALS = 1e18;

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

	event Execute(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 indexA,
		uint256 indexB,
		Order orderA,
		Order orderB
	);

	event Cancel(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 index,
		Order order
	);

	error NotAContract();
	error IncompatibleToken();
	error OrderNotActive();
	error TriggerTooHigh();
	error NotSupported();
	error CantExecuteOrderA();
	error CantExecuteOrderB();
	error InvalidToken();
	error CantDepositETH();
	error CantCancel();
	error SameBuyer();
	error PriceTooHigh();
	error PriceOverflow();
	error OrderAIncorrectlyFulfilled();
	error OrderBIncorrectlyFulfilled();

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
		WETH = IWETH(_WETH);
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
			revert TriggerTooHigh();
		}

		if (
			(orderType == OrderType.StopLoss &&
				!priceOracle.exist(sellToken)) || !priceOracle.exist(buyToken)
		) {
			revert IncompatibleToken();
		}

		if (msg.value > 0) {
			WETH.deposit{ value: msg.value }();
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
			orderType,
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

	function cancelOrder(
		address sellToken,
		address buyToken,
		uint256 index
	) external {
		Order storage order = orders[sellToken][buyToken][index];
		uint256 amountToTransfer = order.sellToComplete;
		if (
			order.orderStatus != OrderStatus.Active ||
			order.buyer != msg.sender ||
			amountToTransfer == 0
		) {
			revert CantCancel();
		}

		order.orderStatus = OrderStatus.Canceled;
		order.sellToComplete = 0;

		TransferHelper.safeTransfer(
			IERC20(sellToken),
			msg.sender,
			amountToTransfer
		);

		emit Cancel(msg.sender, sellToken, buyToken, index, order);
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

		address buyerA = orderA.buyer;
		address buyerB = orderB.buyer;

		if (buyerA == buyerB) {
			revert SameBuyer();
		}

		uint256 priceOrderA = (orderA.buyAmount * PRICE_DECIMALS) /
			orderA.sellAmount;
		uint256 priceOrderB = (orderB.sellAmount * PRICE_DECIMALS) /
			orderB.buyAmount;
		if (priceOrderA > priceOrderB) {
			revert PriceTooHigh();
		}

		uint128 amountTransfered = orderA.buyToComplete;
		if (amountTransfered > orderB.sellToComplete) {
			amountTransfered = orderB.sellToComplete;
		}

		// we sold as order B price
		uint256 soldPrice = (amountTransfered * orderB.buyAmount) /
			orderB.sellAmount;
		if (soldPrice > type(uint128).max) {
			revert PriceOverflow();
		}
		uint128 soldTransfered = uint128(soldPrice);

		// the token to buy for trader A is the token to sell for trader B
		orderA.buyToComplete -= amountTransfered;
		orderB.sellToComplete -= amountTransfered;

		orderA.sellToComplete -= soldTransfered;
		orderB.buyToComplete -= soldTransfered;

		TransferHelper.safeTransfer(IERC20(buyToken), buyerA, amountTransfered);
		TransferHelper.safeTransfer(IERC20(sellToken), buyerB, soldTransfered);

		if (orderA.buyToComplete == 0) {
			orderA.orderStatus = OrderStatus.Executed;

			uint256 toComplete = orderA.sellToComplete;
			if (toComplete > 0) {
				// reimbourse rest of token
				orderA.sellToComplete = 0;
				TransferHelper.safeTransfer(
					IERC20(sellToken),
					buyerA,
					toComplete
				);
			}
		} else if (orderA.sellToComplete == 0 && orderA.buyToComplete > 0) {
			revert OrderAIncorrectlyFulfilled();
		}

		if (orderB.buyToComplete == 0) {
			orderB.orderStatus = OrderStatus.Executed;

			uint256 toComplete = orderB.sellToComplete;
			if (toComplete > 0) {
				// reimbourse rest of token
				orderB.sellToComplete = 0;
				TransferHelper.safeTransfer(
					IERC20(sellToken),
					buyerB,
					toComplete
				);
			}
		} else if (orderB.sellToComplete == 0 && orderB.buyToComplete > 0) {
			revert OrderBIncorrectlyFulfilled();
		}

		emit Execute(
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

	function countOrders(
		address sellToken,
		address buyToken
	) external view returns (uint256) {
		return orders[sellToken][buyToken].length;
	}

	function getOrder(
		address sellToken,
		address buyToken,
		uint256 index
	) external view returns (Order memory) {
		return orders[sellToken][buyToken][index];
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
			uint256 sellAmount = order.sellAmount;
			uint256 buyAmount = order.buyAmount;
			(uint256 price, uint256 decimals) = priceOracle
				.getAssetPriceRelativeTo(sellToken, buyToken);

			uint8 decimalsSell = IERC20(sellToken).decimals();
			uint8 decimalsBuy = IERC20(buyToken).decimals();
			uint256 sellPrice = (buyAmount * 10 ** decimalsSell) / sellAmount;

			uint256 triggerAmount = sellPrice +
				(sellPrice * order.triggerPercent) /
				PERCENT_DIVISOR;

			can =
				(triggerAmount * 10 ** decimals) >= (price * 10 ** decimalsBuy);
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
