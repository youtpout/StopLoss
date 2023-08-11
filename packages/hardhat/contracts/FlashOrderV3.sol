/*// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./StopLoss.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3FlashCallback.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/libraries/LowGasSafeMath.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

/// @title Flash order
/// @author Youtpout
/// @notice Script to automate order execution from uni v3-pair
contract FlashOrderV3 is IUniswapV3FlashCallback, Ownable {
	using LowGasSafeMath for uint256;
	using LowGasSafeMath for int256;

	struct FlashInfo {
		address sellToken;
		address buyToken;
		uint256 indexOrder;
		uint128 sellAmount;
		uint128 buyAmount;
		address pair1;
		address pair2;
		uint256[] amounts;
		PoolInfo[] pool;
	}

	struct PoolInfo {
		address token0;
		address token1;
		uint24 fee;
	}

	StopLoss immutable stopLoss;
	address immutable weth;
	ISwapRouter public immutable swapRouter;
	IUniswapV3Factory public immutable factory;

	mapping(address => bool) approvedUser;

	constructor(
		address _stopLoss,
		address _factory,
		address _swapRouter,
		address _weth
	) {
		weth = _weth;
		stopLoss = StopLoss(_stopLoss);
		swapRouter = ISwapRouter(_swapRouter);
		factory = IUniswapV3Factory(_factory);

		approvedUser[_msgSender()] = true;
	}

	fallback() external {
		(uint256 fee0, uint256 fee1, bytes memory data) = abi.decode(
			msg.data[4:],
			(uint256, uint256, bytes)
		);
		uniswapV3FlashCallback(fee0, fee1, data);
	}

	receive() external payable {}

	function setApprovedUser(address user, bool approved) external onlyOwner {
		approvedUser[user] = approved;
	}

	function flashSwap(
		address sellToken,
		address buyToken,
		uint256 indexOrder,
		PoolInfo[] calldata pools
	) external payable onlyOwner {
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

		uint256[] memory amounts = new uint256[](2);

		PoolAddress.PoolKey memory poolKey = PoolAddress.PoolKey(
			pools[0].token0,
			pools[0].token1,
			pools[0].fee
		);

		IUniswapV3Pool pool = IUniswapV3Pool(
			PoolAddress.computeAddress(address(factory), poolKey)
		);

		PoolAddress.PoolKey memory poolKey2;
		IUniswapV3Pool pool2;
		bytes memory path;
		if (pools.length == 1) {
			path = abi.encodePacked(
				pools[0].token0,
				pools[0].fee,
				pools[0].token1
			);
		} else if (pools.length == 2) {
			path = abi.encodePacked(
				pools[0].token0,
				pools[0].fee,
				pools[0].token1,
				pools[1].fee,
				pools[1].token1
			);

			poolKey2 = PoolAddress.PoolKey(
				pools[1].token0,
				pools[1].token1,
				pools[1].fee
			);
			pool2 = IUniswapV3Pool(
				PoolAddress.computeAddress(address(factory), poolKey2)
			);
		} else {
			revert ("Not supported pool list");
		}

		ISwapRouter.ExactInputParams memory params = ISwapRouter
			.ExactInputParams({
				path: path,
				recipient: address(this),
				deadline: block.timestamp,
				amountIn: amountInMax,
				amountOutMinimum: 0
			});

		uint256 amountOut = swapRouter.exactInput(params);

		amounts[0] = amountInMax;
		amounts[1] = amountOut;

		require(amountOut >= buyAmount, "EXCESSIVE_OUTPUT_AMOUNT");

		FlashInfo memory datas = FlashInfo(
			sellToken,
			buyToken,
			indexOrder,
			order.sellToComplete,
			order.buyToComplete,
			address(pool),
			address(pool2),
			amounts,
			pools
		);
		// Need to pass some data to trigger uniswapV2Call
		bytes memory data = abi.encode(datas);

		(uint256 firstAmount, uint256 secondAmount) = sellToken < buyToken
			? (uint256(0), amountOut)
			: (amountOut, uint256(0));

		pool.flash(address(this), firstAmount, secondAmount, data);
	}

	function uniswapV3FlashCallback(
		uint256 fee0,
		uint256 fee1,
		bytes memory data
	) public {
		FlashInfo memory result = abi.decode(data, (FlashInfo));

		if (result.pair2 != address(0) && result.pair1 == msg.sender) {
			// (uint256 firstAmount, uint256 secondAmount) = result.pool[1] <
			// 	result.pool[2]
			// 	? (uint256(0), result.amounts[2])
			// 	: (result.amounts[2], uint256(0));
			// IERC20(result.paths[1]).transfer(result.pair2, result.amounts[1]);
			// IUniswapV2Pair(result.pair2).swap(
			// 	firstAmount,
			// 	secondAmount,
			// 	address(this),
			// 	data
			// );
		} else {
			uint256 amountDeposit = result.amounts[result.amounts.length - 1];
			uint256 amountOut = result.amounts[0];
			address lastPath = result.buyToken;
			address firstPath = result.sellToken;

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
*/