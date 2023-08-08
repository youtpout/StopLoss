// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceOracle is Initializable, AccessControlUpgradeable {
	bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

	mapping(address => AggregatorV3Interface) public dataFeeds;

	error NotAContract();

	function initialize() public initializer {
		__AccessControl_init();

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(CONTROLLER_ROLE, msg.sender);
	}

	function addPriceFeed(
		address token,
		address priceFeed
	) external onlyRole(CONTROLLER_ROLE) {
		if (!_isContract(token) || !_isContract(priceFeed)) {
			revert NotAContract();
		}

		dataFeeds[token] = AggregatorV3Interface(priceFeed);
	}

	function removePriceFeed(address token) external onlyRole(CONTROLLER_ROLE) {
		dataFeeds[token] = AggregatorV3Interface(address(0));
	}

	function getAssetPriceInUsd(
		address token
	) external view returns (uint256 price, uint256 decimals) {
		AggregatorV3Interface feed = dataFeeds[token];
		(, int256 answer, , , ) = feed.latestRoundData();
		price = uint256(answer);
		decimals = feed.decimals();
	}

	function getAssetPriceRelativeTo(
		address token,
		address relativeTo
	) external view returns (uint256 price, uint256 decimals) {
		AggregatorV3Interface feed = dataFeeds[token];
		AggregatorV3Interface feedTo = dataFeeds[relativeTo];
		(, int256 answer, , , ) = feed.latestRoundData();
		(, int256 answerTo, , , ) = feedTo.latestRoundData();
		decimals = feed.decimals();
		uint256 decimalsTo = feedTo.decimals();

		price = (uint256(answer) * 10 ** decimalsTo) / uint256(answerTo);
	}

	function _isContract(address addr) private view returns (bool) {
		uint256 size;
		assembly {
			size := extcodesize(addr)
		}
		return size > 0;
	}
}
