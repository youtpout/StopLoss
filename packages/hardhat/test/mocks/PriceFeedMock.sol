// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeedMock is AggregatorV3Interface {
	function decimals() external view returns (uint8) {
		return 8;
	}

	function description() external view returns (string memory) {
		return "LINK / USD";
	}

	function version() external view returns (uint256) {
		return 4;
	}

	function getRoundData(
		uint80 _roundId
	)
		external
		view
		returns (
			uint80 roundId,
			int256 answer,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (
			uint80(_roundId),
			int256((_roundId * block.timestamp) / 10000),
			block.timestamp - 1000,
			block.timestamp - 500,
			uint80(_roundId + 1)
		);
	}

	function latestRoundData()
		external
		view
		returns (
			uint80 roundId,
			int256 answer,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (
			uint80(block.timestamp * 10),
			int256((block.timestamp % 70) * 10 ** 8),
			block.timestamp - 500,
			block.timestamp - 500,
			uint80(block.timestamp * 10)
		);
	}
}
