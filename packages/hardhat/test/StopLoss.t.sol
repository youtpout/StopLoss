// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Fixture } from "./Fixture.t.sol";
import { StopLoss } from "contracts/StopLoss.sol";
import { TestERC20 } from "contracts/TestERC20.sol";
import { console } from "forge-std/console.sol";

contract StopLossTests is Fixture {
	function setUp() public override {
		super.setUp();

		TestERC20 testErc20 = new TestERC20("Fake Ether", "fEth");
	}

	function test_AddStopLossOrder() public {
		deal(daniel, 10 ether);

		vm.startPrank(daniel);

		uint256 usdcAmount = 1800 * 10 ** usdcToken.decimals();
		uint16 onePercent = 100;

		stopLoss.addOrder{ value: 1 ether }(
			StopLoss.OrderType.StopLoss,
			address(wEth),
			address(usdcToken),
			uint128(1 ether),
			uint128(usdcAmount),
			onePercent
		);

		vm.stopPrank();
	}

	function test_AddLimitOrder() public {
		deal(daniel, 10 ether);

		vm.startPrank(daniel);

		uint256 usdcAmount = 1800 * 10 ** usdcToken.decimals();

		stopLoss.addOrder{ value: 1 ether }(
			StopLoss.OrderType.Limit,
			address(wEth),
			address(usdcToken),
			uint128(1 ether),
			uint128(usdcAmount),
			0
		);

		vm.stopPrank();
	}

	function test_CancelOrder() public {
		deal(daniel, 10 ether);

		vm.startPrank(daniel);

		uint256 usdcAmount = 1800 * 10 ** usdcToken.decimals();

		stopLoss.addOrder{ value: 1 ether }(
			StopLoss.OrderType.Limit,
			address(wEth),
			address(usdcToken),
			uint128(1 ether),
			uint128(usdcAmount),
			0
		);

		stopLoss.cancelOrder(address(wEth), address(usdcToken), 0);

		vm.stopPrank();
	}

	function test_ExecuteOrder() public {
		deal(daniel, 10 ** 36);
		uint256 amountAlice = 20 * 10 * 18 * 10 ** usdcToken.decimals();
		deal(address(usdcToken), alice, amountAlice);
		vm.startPrank(daniel);

		uint256 usdcAmount = 18 * 10 * 18 * 10 ** usdcToken.decimals();

		stopLoss.addOrder{ value: 10 ** 36 }(
			StopLoss.OrderType.Limit,
			address(wEth),
			address(usdcToken),
			uint128(10 ** 36),
			uint128(usdcAmount),
			0
		);

		vm.stopPrank();

		vm.startPrank(alice);

		usdcToken.approve(address(stopLoss), amountAlice);

		stopLoss.addOrder(
			StopLoss.OrderType.Limit,
			address(usdcToken),
			address(wEth),
			uint128(amountAlice),
			uint128(10 ** 36),
			0
		);

		vm.stopPrank();

		vm.startPrank(deployer);

		stopLoss.executeOrder(address(usdcToken), address(wEth), 0, 0);

		vm.stopPrank();

		assertEq(usdcAmount, usdcToken.balanceOf(daniel));
		assertEq(10 ** 36, wEth.balanceOf(alice));
		assertEq(amountAlice - usdcAmount, usdcToken.balanceOf(alice));

		(StopLoss.OrderData[] memory allOrders, ) = stopLoss.fetchPageOrders(
			0,
			100
		);
		assertEq(allOrders.length, 2);
		assertEq(allOrders[0].order.sellAmount, 10 ** 36);
		assertEq(allOrders[1].order.sellAmount, amountAlice);
	}

	function test_ExecuteBigOrder() public {
		deal(daniel, 1000 ether);
		uint256 amountAlice = 200_000 * 10 ** usdcToken.decimals();
		deal(address(usdcToken), alice, amountAlice);
		vm.startPrank(daniel);

		uint256 usdcAmount = 180_000 * 10 ** usdcToken.decimals();

		stopLoss.addOrder{ value: 100 ether }(
			StopLoss.OrderType.Limit,
			address(wEth),
			address(usdcToken),
			uint128(100 ether),
			uint128(usdcAmount),
			0
		);

		vm.stopPrank();

		vm.startPrank(alice);

		usdcToken.approve(address(stopLoss), amountAlice);

		stopLoss.addOrder(
			StopLoss.OrderType.Limit,
			address(usdcToken),
			address(wEth),
			uint128(amountAlice),
			uint128(100 ether),
			0
		);

		vm.stopPrank();

		vm.startPrank(deployer);

		stopLoss.executeOrder(address(usdcToken), address(wEth), 0, 0);

		vm.stopPrank();

		assertEq(usdcAmount, usdcToken.balanceOf(daniel));
		assertEq(100 ether, wEth.balanceOf(alice));
		assertEq(amountAlice - usdcAmount, usdcToken.balanceOf(alice));

		(StopLoss.OrderData[] memory allOrders, ) = stopLoss.fetchPageOrders(
			0,
			100
		);
		assertEq(allOrders.length, 2);
		assertEq(allOrders[0].order.sellAmount, 100 ether);
		assertEq(allOrders[1].order.sellAmount, amountAlice);
	}

	function test_RevertOrder() public {
		deal(daniel, 10 ether);
		uint256 amountAlice = 2000 * 10 ** usdcToken.decimals();
		deal(address(usdcToken), alice, amountAlice);
		vm.startPrank(daniel);

		uint256 usdcAmount = 2200 * 10 ** usdcToken.decimals();

		stopLoss.addOrder{ value: 1 ether }(
			StopLoss.OrderType.Limit,
			address(wEth),
			address(usdcToken),
			uint128(1 ether),
			uint128(usdcAmount),
			0
		);

		vm.stopPrank();

		vm.startPrank(alice);

		usdcToken.approve(address(stopLoss), amountAlice);

		stopLoss.addOrder(
			StopLoss.OrderType.Limit,
			address(usdcToken),
			address(wEth),
			uint128(amountAlice),
			uint128(1 ether),
			0
		);

		vm.stopPrank();

		vm.startPrank(deployer);

		vm.expectRevert(StopLoss.PriceTooHigh.selector);
		stopLoss.executeOrder(address(usdcToken), address(wEth), 0, 0);

		vm.stopPrank();
	}

	function test_ExecuteStopLossOrder() public {
		deal(daniel, 10 ether);
		uint256 thousand_links = 1000 * 10 ** linkToken.decimals();
		uint256 stop_usdc = 7000 * 10 ** usdcToken.decimals();
		deal(address(linkToken), alice, thousand_links);

		vm.startPrank(alice);

		linkToken.approve(address(stopLoss), thousand_links);
		stopLoss.addOrder(
			StopLoss.OrderType.StopLoss,
			address(linkToken),
			address(usdcToken),
			uint128(thousand_links),
			uint128(stop_usdc),
			500 // 5% trigger at 7.35 $ (7350 $ for 1000 link)
		);

		vm.stopPrank();

		vm.startPrank(daniel);

		uint256 sellusdc = 7200 * 10 ** usdcToken.decimals();
		deal(address(usdcToken), daniel, sellusdc);
		usdcToken.approve(address(stopLoss), sellusdc);

		// daniel create order limit, 7200 $ for 1000 links
		stopLoss.addOrder(
			StopLoss.OrderType.Limit,
			address(usdcToken),
			address(linkToken),
			uint128(sellusdc),
			uint128(thousand_links),
			0
		);

		vm.stopPrank();

		vm.startPrank(deployer);

		vm.expectRevert(StopLoss.CantExecuteOrderB.selector);
		stopLoss.executeOrder(address(usdcToken), address(linkToken), 0, 0);

		priceFeedMock.setAnswer(751599200);

		vm.expectRevert(StopLoss.CantExecuteOrderB.selector);
		stopLoss.executeOrder(address(usdcToken), address(linkToken), 0, 0);

		priceFeedMock.setAnswer(731599200);

		// execute when price lower than 7.35$
		stopLoss.executeOrder(address(usdcToken), address(linkToken), 0, 0);

		vm.stopPrank();

		assertEq(thousand_links, linkToken.balanceOf(daniel));
		assertEq(stop_usdc, usdcToken.balanceOf(alice));
		assertEq(sellusdc - stop_usdc, usdcToken.balanceOf(daniel));
	}
}
