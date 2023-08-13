/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceFeedEthMock, PriceOracle, StopLoss, TestERC20 } from "../typechain-types";

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("owner", owner.address);

  const wethAddress = "0x4200000000000000000000000000000000000006";

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const pOracle = PriceOracle.attach("0x0f97f954B07f425e2ADA71b83A7423F83765238c");

  console.log("price Oracle", await pOracle.getAddress());
  await pOracle.addPriceFeed(
    "0x13222C48eed0feCfCe16aA76670D2Cbb7f7B0b6F",
    "0xF824e867ae6e45f2556DEE10F7441e34AADB8188",
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
