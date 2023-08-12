import { useEffect, useState } from "react";
import { useEthersSigner } from "../../services/ethers";
import addresses from "../constants/addresses";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { type WalletClient, useNetwork, useWalletClient } from "wagmi";
import { TestERC20__factory } from "~~/types/typechain-types";

export const MintToken = () => {
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [token, setToken] = useState("fEth");
  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    setChainId(chain?.id || 420);
  }, [chain]);

  useEffect(() => {
    getBalance().then();
  }, [chain, signer, token]);

  const fEth = addresses.find(x => x.symbol === "fEth");
  const fLink = addresses.find(x => x.symbol === "fLink");
  const fUSDC = addresses.find(x => x.symbol === "fUSDC");
  const fBTC = addresses.find(x => x.symbol === "fBTC");
  const mEth = addresses.find(x => x.symbol === "mEth");

  const mint = async () => {
    try {
      const tokenSelected = addresses.find(x => x.symbol === token);
      const address = tokenSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const user = await signer.getAddress();
        console.log("address", address);
        const tokenContract = TestERC20__factory.connect(address, signer);
        const amountEth = ethers.utils.parseEther(amount);

        toast("Minting");
        const execute = await tokenContract.mint(user, amountEth);
        await execute.wait();

        toast.success("Successfully minted!");
      }
    } catch (error) {
      toast.error("Error " + JSON.stringify(error));
    }
  };

  const getBalance = async () => {
    try {
      const tokenSelected = addresses.find(x => x.symbol === token);
      const address = tokenSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const user = await signer.getAddress();
        console.log("address", address);
        const tokenContract = TestERC20__factory.connect(address, signer);
        const amt = await tokenContract.balanceOf(user);
        setBalance(ethers.utils.formatEther(amt));
      }
    } catch (error) {
      toast.error("Error " + JSON.stringify(error));
    }
  };

  return (
    <div className="mint-info">
      <h3>Mint token for test</h3>
      <div className="mint-content">
        <select value={token} onChange={e => setToken(e.target.value)}>
          <option value={"fEth"}>fEth</option>
          <option value={"fLink"}>fLink</option>
          <option value={"fUSDC"}>fUSDC</option>
          <option value={"fBTC"}>fBTC</option>
          <option value={"mEth"}>mEth</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          defaultValue={amount}
          onChange={e => setAmount(e.target.value)}
        ></input>
        <div className="mint-button">
          <button onClick={() => mint()}>Mint</button>
        </div>
        <div>Actual balance : {balance}</div>
      </div>
    </div>
  );
};