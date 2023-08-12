/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceFeedEthMock, PriceOracle, StopLoss, TestERC20 } from "../typechain-types";

async function main() {
  const wethAddress = "0x4200000000000000000000000000000000000006";

  const fethAddress = await deployToken("Fake Ether", "fEth");
  const linkAddress = await deployToken("Fake Link", "fLink");
  const usdcAddress = await deployToken("Fake USDC", "fUsdc");
  const btcAddress = await deployToken("Fake Bitcoin", "fBTC");
  const methAddress = await deployToken("Manipulable Ether", "mEth");

  const PriceFeedEthMock = await ethers.getContractFactory("PriceFeedEthMock");
  const pEMock = (await PriceFeedEthMock.deploy()) as PriceFeedEthMock;
  await pEMock.deployed();
  console.log("PriceFeedEthMock", pEMock.address);

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const pOracle = (await upgrades.deployProxy(PriceOracle)) as PriceOracle;
  await pOracle.deployed();
  console.log("price Oracle", pOracle.address);
  pOracle.addPriceFeed(methAddress, pEMock.address);
  pOracle.addPriceFeed(fethAddress, "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8");
  pOracle.addPriceFeed(wethAddress, "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8");
  pOracle.addPriceFeed(linkAddress, "0x69C5297001f38cCBE30a81359da06E5256bd28B9");
  pOracle.addPriceFeed(usdcAddress, "0x2636B223652d388721A0ED2861792DA9062D8C73");
  pOracle.addPriceFeed(btcAddress, "0xC16679B963CeB52089aD2d95312A5b85E318e9d2");

  const StopLoss = await ethers.getContractFactory("StopLoss");
  const sLoss = (await upgrades.deployProxy(StopLoss), [pOracle.address, wethAddress]) as unknown as StopLoss;
  await sLoss.deployed();
  console.log("StopLoss", sLoss.address);
}

async function deployToken(name: string, symbol: string): Promise<string> {
  const FakeErc20 = await ethers.getContractFactory("TestERC20");
  const ferc20 = (await FakeErc20.deploy(name, symbol)) as TestERC20;
  await ferc20.deployed();
  console.log(name, ferc20.address);
  return ferc20.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
