// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Fixture } from "./Fixture.t.sol";
import { StopLoss } from "contracts/StopLoss.sol";
import { console } from "forge-std/console.sol";


contract StopLossTests is Fixture {
	function setUp() public override {
		super.setUp();
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
}
