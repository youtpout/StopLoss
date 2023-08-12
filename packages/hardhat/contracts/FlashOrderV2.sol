// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./StopLoss.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Callee.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

/// @title Flash order
/// @author Youtpout
/// @notice Script to automate order execution from uni v2-pair
contract FlashOrderV2 is IUniswapV2Callee, Ownable {
	struct FlashInfo {
		address sellToken;
		address buyToken;
		uint256 indexOrder;
		uint128 sellAmount;
		uint128 buyAmount;
		address pair1;
		address pair2;
		uint256[] amounts;
		address[] paths;
	}

	StopLoss immutable stopLoss;
	address immutable weth;
	address router;
	address factory;

	mapping(address => bool) approvedUser;

	constructor(address _stopLoss, address _weth) {
		weth = _weth;
		stopLoss = StopLoss(_stopLoss);

		approvedUser[_msgSender()] = true;
	}

	fallback() external {
		(
			address sender,
			uint256 firstAmount,
			uint256 secondAmount,
			bytes memory data
		) = abi.decode(msg.data[4:], (address, uint256, uint256, bytes));
		uniswapV2Call(sender, firstAmount, secondAmount, data);
	}

	receive() external payable {}

	function setApprovedUser(address user, bool approved) external onlyOwner {
		approvedUser[user] = approved;
	}

	function flashSwap(
		address sellToken,
		address buyToken,
		uint256 indexOrder,
		address _router,
		address _factory,
		address[] calldata paths
	) external payable onlyOwner {
		router = _router;
		factory = _factory;

		require(
			stopLoss.canExecuteOrder(sellToken, buyToken, indexOrder),
			"Cant execute order"
		);

		StopLoss.Order memory order = stopLoss.getOrder(
			sellToken,
			buyToken,
			indexOrder
		);

		uint256 buyAmount = order.buyToComplete;
		uint256 amountInMax = (buyAmount * order.sellAmount) / order.buyAmount;

		uint256[] memory amounts = IUniswapV2Router02(router).getAmountsOut(
			amountInMax,
			paths
		);

		require(
			amounts[amounts.length - 1] >= buyAmount,
			"EXCESSIVE_OUTPUT_AMOUNT"
		);

		address pair1 = IUniswapV2Factory(factory).getPair(paths[0], paths[1]);
		address pair2;
		if (paths.length > 2) {
			pair2 = IUniswapV2Factory(factory).getPair(paths[1], paths[2]);
		}
		FlashInfo memory datas = FlashInfo(
			sellToken,
			buyToken,
			indexOrder,
			order.sellToComplete,
			order.buyToComplete,
			pair1,
			pair2,
			amounts,
			paths
		);
		// Need to pass some data to trigger uniswapV2Call
		bytes memory data = abi.encode(datas);

		(uint256 firstAmount, uint256 secondAmount) = paths[0] < paths[1]
			? (uint256(0), amounts[1])
			: (amounts[1], uint256(0));

		IUniswapV2Pair(pair1).swap(
			firstAmount,
			secondAmount,
			address(this),
			data
		);

		router = address(0);
		factory = address(0);
	}

	function uniswapV2Call(
		address,
		uint256,
		uint256,
		bytes memory data
	) public {
		FlashInfo memory result = abi.decode(data, (FlashInfo));

		if (result.pair2 != address(0) && result.pair1 == msg.sender) {
			(uint256 firstAmount, uint256 secondAmount) = result.paths[1] <
				result.paths[2]
				? (uint256(0), result.amounts[2])
				: (result.amounts[2], uint256(0));
			IERC20(result.paths[1]).transfer(result.pair2, result.amounts[1]);
			IUniswapV2Pair(result.pair2).swap(
				firstAmount,
				secondAmount,
				address(this),
				data
			);
		} else {
			uint256 amountDeposit = result.amounts[result.amounts.length - 1];
			uint256 amountOut = result.amounts[0];
			address lastPath = result.paths[result.paths.length - 1];
			address firstPath = result.paths[0];

			IERC20(result.buyToken).approve(
				address(stopLoss),
				type(uint256).max
			);

			uint256 indexOrderB = stopLoss.countOrders(
				address(result.buyToken),
				address(result.sellToken)
			);

			// add complementary order to focus order to execute it
			stopLoss.addOrder(
				StopLoss.OrderType.Limit,
				address(result.buyToken),
				address(result.sellToken),
				uint128(result.buyAmount),
				uint128(result.sellAmount),
				0
			);

			stopLoss.executeOrder(
				address(result.sellToken),
				address(result.buyToken),
				result.indexOrder,
				indexOrderB
			);

			// reimbourse first pair
			IERC20(firstPath).transfer(result.pair1, amountOut);
		}

		require(approvedUser[tx.origin], "NA");
	}

	function withdraw(address _token) external onlyOwner {
		uint256 amt = IERC20(_token).balanceOf(address(this));
		IERC20(_token).transfer(owner(), amt);
	}

	function withdrawAmount(address _token, uint256 _amt) external onlyOwner {
		IERC20(_token).transfer(owner(), _amt);
	}

	function withdrawEth() public onlyOwner {
		(bool sent, ) = payable(owner()).call{ value: address(this).balance }(
			""
		);
		require(sent, "Failed to send Ether");
	}
}
