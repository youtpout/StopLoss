// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Test, Vm } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { StopLoss } from "contracts/StopLoss.sol";
import { PriceOracle } from "contracts/PriceOracle.sol";
import { PriceFeedMock } from "./mocks/PriceFeedMock.sol";

contract StopLossExecuteTests is Test {
	StopLoss stopLoss = StopLoss(0xb7672932294f0650c8c668B8c834596A620d27c1);

	address deployer = makeAddr("Deployer");
	address alice = makeAddr("Alice");
	address bob = makeAddr("Bob");
	address charlie = makeAddr("Charlie");
	address daniel = makeAddr("Daniel");

	ERC20 public constant usdcToken =
		ERC20(0x91673a7567Ea046e98a8b909fF56f21b4E12eE40);

	ERC20 public constant btcToken =
		ERC20(0xA0a59C091E59E70C0cf17Fd43946C7e4D074B6F3);

	ERC20 public constant wEth =
		ERC20(0x4200000000000000000000000000000000000006);

	ERC20 public constant linkToken =
		ERC20(0x6Ff9acFE5B23FA3a44C4979b5bd60A29B706C912);

	function setUp() public {
		vm.createSelectFork("https://goerli.base.org");
		assertEq(block.chainid, 84531);
		vm.label(address(stopLoss), "Stop Loss");
	}

	function test_ExecuteOrder() public {
		deal(daniel, 1 ether);
		uint256 amountAlice = 2000 * 10 ** usdcToken.decimals();
		deal(address(usdcToken), alice, amountAlice);
		vm.startPrank(daniel);

		uint256 usdcAmount = 2000 * 10 ** usdcToken.decimals();

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

		stopLoss.executeOrder(address(usdcToken), address(wEth), 0, 0);

		vm.stopPrank();

		assertEq(usdcAmount, usdcToken.balanceOf(daniel));
		assertEq(1 ether, wEth.balanceOf(alice));
		assertEq(amountAlice - usdcAmount, usdcToken.balanceOf(alice));
	}

	function test_ExecuteOrderOnchain() public {
		vm.startPrank(deployer);

		vm.expectRevert(StopLoss.OrderBIncorrectlyFulfilled.selector);
		stopLoss.executeOrder(
			address(0x91673a7567Ea046e98a8b909fF56f21b4E12eE40),
			address(0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3),
			5,
			3
		);

		stopLoss.executeOrder(
			address(0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3),
			address(0x91673a7567Ea046e98a8b909fF56f21b4E12eE40),
			3,
			5
		);

		vm.stopPrank();
	}
}
