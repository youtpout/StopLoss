/* eslint-disable @typescript-eslint/no-unused-vars */
import { ethers, upgrades } from "hardhat";
import { PriceFeedEthMock, PriceOracle, StopLoss, TestERC20 } from "../typechain-types";

async function main() {
  const [owner] = await ethers.getSigners();

  console.log("owner", owner.address);

  const wethAddress = "0x4200000000000000000000000000000000000006";

  const PriceOracle = await ethers.getContractFactory("PriceOracle");
  const pOracle = PriceOracle.attach("0x2a6b481Af079aD10c945508Da5f44d13356dABc2");

  console.log("price Oracle", await pOracle.getAddress());
  await pOracle.addPriceFeed(
    "0xB35d9E3A7f27982b7f0ABBEe731B109deeD5d2bc",
    "0xdEa0F6213B346fBAB757E60949D819cD846748a3",
  );
  await pOracle.addPriceFeed(
    "0xb7672932294f0650c8c668B8c834596A620d27c1",
    "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8",
  );
  await pOracle.addPriceFeed(wethAddress, "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8");
  await pOracle.addPriceFeed(
    "0xBe2C7317968Ca44304Fa88ca52585d6dD8AAFF93",
    "0x69C5297001f38cCBE30a81359da06E5256bd28B9",
  );
  await pOracle.addPriceFeed(
    "0x3669CC9530dDD1283a9258DBC98A8011dE610A88",
    "0x2636B223652d388721A0ED2861792DA9062D8C73",
  );
  await pOracle.addPriceFeed(
    "0xB91da63f4403B3295eba6ea19822517AF41Bfa03",
    "0xC16679B963CeB52089aD2d95312A5b85E318e9d2",
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
