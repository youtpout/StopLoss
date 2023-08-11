// SPDX-License-Identifier: MIT
/* pragma solidity ^0.8.0;

import { Fixture } from "./Fixture.t.sol";
import { StopLoss } from "contracts/StopLoss.sol";
import { FlashOrderV3 } from "contracts/FlashOrderV3.sol";
import { console } from "forge-std/console.sol";

contract FlashOrderTests is Fixture {
	FlashOrderV3 public flashOrder;
	address factoryV3Optimism = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
	address routerV3Optimism = 0xE592427A0AEce92De3Edee1F18E0157C05861564;

	function setUp() public override {
		super.setUp();

		vm.prank(deployer);
		flashOrder = new FlashOrderV3(
			address(stopLoss),
			factoryV3Optimism,
			routerV3Optimism,
			address(wEth)
		);
	}

	function test_FlashOrder() public {
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

		// deployer do a flash loan to execute daniel order
		vm.startPrank(deployer);
		vm.stopPrank();
	}
}
*/