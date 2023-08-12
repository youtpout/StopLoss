/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceFeedEthMock, PriceOracle, StopLoss, TestERC20 } from "../typechain-types";

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("owner", owner.address);

  const wethAddress = "0x4200000000000000000000000000000000000006";

  const fethAddress = await deployToken("Fake Ether", "fEth");
  const linkAddress = await deployToken("Fake Link", "fLink");
  const usdcAddress = await deployToken("Fake USDC", "fUsdc");
  const btcAddress = await deployToken("Fake Bitcoin", "fBTC");
  const methAddress = await deployToken("Manipulable Ether", "mEth");

  const pEMock = (await ethers.deployContract("PriceFeedEthMock")) as unknown as PriceFeedEthMock;
  await pEMock.waitForDeployment();
  const peMockAddress = await pEMock.getAddress();
  console.log("PriceFeedEthMock", peMockAddress);

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const pOracle = (await upgrades.deployProxy(PriceOracle)) as unknown as PriceOracle;
  await pOracle.waitForDeployment();

  console.log("price Oracle", await pOracle.getAddress());
  // pOracle.addPriceFeed(methAddress, peMockAddress);
  // pOracle.addPriceFeed(fethAddress, "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8");
  // pOracle.addPriceFeed(wethAddress, "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8");
  // pOracle.addPriceFeed(linkAddress, "0x69C5297001f38cCBE30a81359da06E5256bd28B9");
  // pOracle.addPriceFeed(usdcAddress, "0x2636B223652d388721A0ED2861792DA9062D8C73");
  // pOracle.addPriceFeed(btcAddress, "0xC16679B963CeB52089aD2d95312A5b85E318e9d2");

  const addressOracle = await pOracle.getAddress();

  const StopLoss = await ethers.getContractFactory("StopLoss");
  const sLoss = (await upgrades.deployProxy(StopLoss, [addressOracle, wethAddress])) as unknown as StopLoss;
  await sLoss.waitForDeployment();
  console.log("StopLoss", await sLoss.getAddress());
}

async function deployToken(name: string, symbol: string): Promise<string> {
  const ferc20 = (await ethers.deployContract("TestERC20", [name, symbol], { gas: 1000000 })) as unknown as TestERC20;
  await ferc20.waitForDeployment();
  console.log(name, await ferc20.getAddress());
  return await ferc20.getAddress();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
