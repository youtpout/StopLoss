// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./interfaces/IPriceOracle.sol";

contract StopLoss is Initializable, AccessControlUpgradeable {
	bytes32 public constant CONTROLLER_ROLE = keccak256("CONTROLLER_ROLE");

	enum OrderType {
		None,
		Market,
		Limit,
		StopLoss,
		TrailingStop
	}

	IPriceOracle public priceOracle;

	error NotAContract();

	function initialize(address _priceOracle) public initializer {
		if (!_isContract(_priceOracle)) {
			revert NotAContract();
		}

		__AccessControl_init();

		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(CONTROLLER_ROLE, msg.sender);

		priceOracle = IPriceOracle(_priceOracle);
	}

	function updatePriceOracle(
		address _priceOracle
	) external initializer onlyRole(CONTROLLER_ROLE) {
		if (!_isContract(_priceOracle)) {
			revert NotAContract();
		}

		priceOracle = IPriceOracle(_priceOracle);
	}

	function _isContract(address addr) private view returns (bool) {
		uint256 size;
		assembly {
			size := extcodesize(addr)
		}
		return size > 0;
	}
}
