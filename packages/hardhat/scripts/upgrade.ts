/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceFeedEthMock, PriceOracle, StopLoss, TestERC20 } from "../typechain-types";

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("owner", owner.address);

  const StopLoss = await ethers.getContractFactory("StopLoss");
  const sLoss = (await upgrades.upgradeProxy(
    "0xDeEB811d79382b42eE60EDB8a204F5949d1169f4",
    StopLoss,
  )) as unknown as StopLoss;
  0xf792600a564167a61feb0a96cf120113d6ccd066;
  await sLoss.waitForDeployment();
  console.log("StopLoss", await sLoss.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
