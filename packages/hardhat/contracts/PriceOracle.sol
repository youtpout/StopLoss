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
	}

	function addPriceFeed(
		address token,
		AggregatorV3Interface priceFeed
	) onlyRole(CONTROLLER_ROLE) {
		if (!_isContract(token) || !_isContract(priceFeed)) {
			revert NotAContract();
		}

		dataFeeds[token] = priceFeed;
	}

	function removePriceFeed(address token) onlyRole(CONTROLLER_ROLE) {
		dataFeeds[token] = address(0);
	}

	function _isContract(address addr) private view returns (bool) {
		uint256 size;
		assembly {
			size := extcodesize(addr)
		}
		return size > 0;
	}
}
