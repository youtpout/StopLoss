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
    "0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3",
    "0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2",
  );
  await pOracle.addPriceFeed(
    "0x6Ff9acFE5B23FA3a44C4979b5bd60A29B706C912",
    "0x907A947C5F34eC68F8D4eD87d4bac3FA6431a4D1",
  );
  await pOracle.addPriceFeed(wethAddress, "0xcD2A119bD1F7DF95d706DE6F2057fDD45A0503E2");
  await pOracle.addPriceFeed(
    "0x91673a7567Ea046e98a8b909fF56f21b4E12eE40",
    "0xb85765935B4d9Ab6f841c9a00690Da5F34368bc0",
  );
  await pOracle.addPriceFeed(
    "0xA0a59C091E59E70C0cf17Fd43946C7e4D074B6F3",
    "0xAC15714c08986DACC0379193e22382736796496f",
  );
  await pOracle.addPriceFeed(
    "0xbEE9a5c8B136b180E2822c82Ba62DC4496Edf1Ab",
    "0xA8fEd8D3f8511f7ac0b1e7148dC66aC8f7Ee883A",
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
