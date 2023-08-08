// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

interface IPriceOracle {
	function addPriceFeed(address token, address priceFeed) external;

	function removePriceFeed(address token) external;

	function dataFeeds(
		address token
	) external view returns (AggregatorV3Interface);

	function getAssetPriceInUsd(
		address token
	) external view returns (uint256 price, uint256 decimals);

	function getAssetPriceRelativeTo(
		address token,
		address relativeTo
	) external view returns (uint256 price, uint256 decimals);

	function exist(address token) external view returns (bool);
}
