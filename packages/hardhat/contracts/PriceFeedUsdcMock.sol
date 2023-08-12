// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceFeedUsdcMock is AggregatorV3Interface {
	int256 public answer = 99994100;

	function decimals() external view returns (uint8) {
		return 8;
	}

	function description() external view returns (string memory) {
		return "USDC / USD";
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
			int256 answer_,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (
			uint80(_roundId),
			answer - int256(uint256(_roundId)),
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
			int256 answer_,
			uint256 startedAt,
			uint256 updatedAt,
			uint80 answeredInRound
		)
	{
		return (
			uint80(block.timestamp * 10),
			answer,
			block.timestamp - 500,
			block.timestamp - 500,
			uint80(block.timestamp * 10)
		);
	}
}
