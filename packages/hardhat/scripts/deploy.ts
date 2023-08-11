/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceOracle, StopLoss } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  const [owner] = await ethers.getSigners();

  const { chainId } = await ethers.getDefaultProvider().getNetwork();

  // optimism
  const wethAddress = "0x4200000000000000000000000000000000000006";

  if (chainId == 8453) {
  } else if (chainId == 999) {
  }

  const ContractItem = await ethers.getContractFactory("PriceOracle");
  const itemContract = (await upgrades.deployProxy(ContractItem)) as PriceOracle;
  await itemContract.deployed();
  console.log("price Oracle", itemContract.address);

  const SpellItem = await ethers.getContractFactory("StopLoss");
  const spellContract = (await upgrades.deployProxy(SpellItem),
  [itemContract.address, wethAddress]) as unknown as StopLoss;
  await spellContract.deployed();
  console.log("StopLoss", spellContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
