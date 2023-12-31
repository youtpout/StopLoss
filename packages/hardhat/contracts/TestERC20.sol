// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestERC20 is ERC20, Ownable {
	constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

	/// for testnet we can mint substitute token to weth/usdc/link/btc ...
	/// @param to user address
	/// @param amount amount token minted
	function mint(address to, uint256 amount) public {
		_mint(to, amount);
	}
}
