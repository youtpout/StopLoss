// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import { Test, Vm } from "forge-std/Test.sol";
import { console } from "forge-std/console.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { StopLoss } from "contracts/StopLoss.sol";
import { PriceOracle } from "contracts/PriceOracle.sol";
import { PriceFeedMock } from "./mocks/PriceFeedMock.sol";

import { TransparentUpgradeableProxy } from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import { ProxyAdmin } from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

contract Fixture is Test {
	address public constant uniswapV2Router =
		0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

	ERC20 public constant usdcToken =
		ERC20(0x7F5c764cBc14f9669B88837ca1490cCa17c31607);

	ERC20 public constant btcToken =
		ERC20(0x68f180fcCe6836688e9084f035309E29Bf0A2095);

	ERC20 public constant wEth =
		ERC20(0x4200000000000000000000000000000000000006);

	ERC20 public constant linkToken =
		ERC20(0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6);

	ProxyAdmin public proxyAdmin;
	StopLoss public stopLoss;
	PriceOracle public priceOracle;

	address deployer = makeAddr("Deployer");
	address alice = makeAddr("Alice");
	address bob = makeAddr("Bob");
	address charlie = makeAddr("Charlie");
	address daniel = makeAddr("Daniel");

	event Add(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 index,
		StopLoss.Order order
	);

	event Execute(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 indexA,
		uint256 indexB,
		StopLoss.Order orderA,
		StopLoss.Order orderB
	);

	event Cancel(
		address indexed sender,
		address indexed sellToken,
		address indexed buyToken,
		uint256 index,
		StopLoss.Order order
	);

	function setUp() public virtual {
		// oprimism as mainnet for test
		vm.createSelectFork(vm.envString("MAINNET"));
		assertEq(block.chainid, 10);

		vm.label(address(usdcToken), "USDC");
		vm.label(address(wEth), "WETH");

		vm.startPrank(deployer);

		proxyAdmin = new ProxyAdmin();

		priceOracle = PriceOracle(
			_deployProxy(
				address(new PriceOracle()),
				abi.encodeWithSelector(PriceOracle.initialize.selector)
			)
		);

		priceOracle.addPriceFeed(
			address(wEth),
			0x13e3Ee699D1909E989722E753853AE30b17e08c5
		);

		priceOracle.addPriceFeed(
			address(btcToken),
			0xD702DD976Fb76Fffc2D3963D037dfDae5b04E593
		);

		priceOracle.addPriceFeed(
			address(usdcToken),
			0x16a9FA2FDa030272Ce99B29CF780dFA30361E0f3
		);

		PriceFeedMock priceFeedMock = new PriceFeedMock();

		priceOracle.addPriceFeed(address(linkToken), address(priceFeedMock));

		console.log("price oracle configured");

		stopLoss = StopLoss(
			_deployProxy(
				address(new StopLoss()),
				abi.encodeWithSelector(
					StopLoss.initialize.selector,
					address(priceOracle),
					address(wEth)
				)
			)
		);

		vm.label(address(priceOracle), "Price Oracle");
		vm.label(address(stopLoss), "Stop Loss");
	}

	function _deployProxy(
		address implementation_,
		bytes memory initializer_
	) internal returns (address) {
		return
			address(
				new TransparentUpgradeableProxy(
					implementation_,
					address(proxyAdmin),
					initializer_
				)
			);
	}
}
