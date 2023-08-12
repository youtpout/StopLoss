import { useEffect, useState } from "react";
import addresses from "../constants/addresses";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import { useEthersSigner } from "~~/services/ethers";
import { StopLoss__factory, TestERC20__factory } from "~~/types/typechain-types";

export const TradeInfo = ({ pair }) => {
  const [orderType, setOrderType] = useState("Limit");
  const [orderSell, setOrderSell] = useState(true);
  const [needApprove, setNeedApprove] = useState(true);
  const [amount, setAmount] = useState(0);
  const [limit, setLimit] = useState(0);
  const [trigger, setTrigger] = useState(1);
  const [triggerPrice, setTriggerPrice] = useState(0);
  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    setChainId(chain?.id || 420);

    if (chain && signer) {
      getAllowance().then;
    }
  }, [chain, signer]);

  useEffect(() => {
    const calc = (limit * trigger) / 100;
    const calcLimit = parseFloat(limit.toString()) + calc;
    setTriggerPrice(calcLimit);
  }, [limit, trigger]);

  const placeOrder = async () => {
    try {
      if (needApprove) {
        toast("Approve the contract for this token");
        return;
      }

      const contractSelected = addresses.find(x => x.name === "Stop Loss");
      const address = contractSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT0 = pair.token0?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT1 = pair.token1?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const stopLossContract = StopLoss__factory.connect(address, signer);
        const amountEth = ethers.utils.parseEther(amount);
        const limitEth = ethers.utils.parseEther(limit);

        const orderTypeEnum = orderType === "Limit" ? 2 : 3;
        const sellToken = orderSell ? addressT0 : addressT1;
        const buyToken = orderSell ? addressT1 : addressT0;
        const sellAmount = orderSell ? amountEth : limitEth;
        const buyAmount = orderSell ? limitEth : amountEth;
        const triggerPercent = trigger * 100;
        toast("Adding");
        const execute = await stopLossContract.addOrder(
          orderTypeEnum,
          sellToken,
          buyToken,
          sellAmount,
          buyAmount,
          triggerPercent,
        );
        await execute.wait();

        toast.success("Order added!");
      } else {
        toast.error("Maybe you are not connected");
      }
    } catch (error) {
      toast.error("Error " + JSON.stringify(error));
    }
  };

  const approve = async () => {
    try {
      const contractSelected = addresses.find(x => x.name === "Stop Loss");
      const address = contractSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT0 = pair.token0?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const tokenContract = TestERC20__factory.connect(addressT0, signer);
        toast("Approving");

        const execute = await tokenContract.approve(address, ethers.constants.MaxUint256);
        await execute.wait();

        toast.success("Contract approved!");
      } else {
        toast.error("Maybe you are not connected");
      }
    } catch (error) {
      toast.error("Error " + JSON.stringify(error));
    }
  };

  const getAllowance = async () => {
    try {
      const contractSelected = addresses.find(x => x.name === "Stop Loss");
      const address = contractSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT0 = pair.token0?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const user = await signer.getAddress();
        const tokenContract = TestERC20__factory.connect(addressT0, signer);
        const amountEth = ethers.utils.parseEther(amount.toString()) as BigNumber;
        const allowance = await tokenContract.allowance(user, address);
        setNeedApprove(amountEth.gt(allowance));
      }
    } catch (error) {
      console.error("get allowance", error);
    }
  };

  return (
    <div className="trade-info">
      <div className="choose-order">
        <button className={orderType === "Limit" ? "selected" : ""} onClick={() => setOrderType("Limit")}>
          Limit
        </button>
        <button className={orderType === "StopLoss" ? "selected" : ""} onClick={() => setOrderType("StopLoss")}>
          Stop loss
        </button>
      </div>
      <div className="trade-content">
        <div className="trade-order">
          <button className={orderSell ? "s-button red" : "s-button not"} onClick={() => setOrderSell(true)}>
            Sell
          </button>
          <button className={!orderSell ? "s-button green" : "s-button not"} onClick={() => setOrderSell(false)}>
            Buy
          </button>
        </div>
        <div>
          <div>
            <input
              className="s-input"
              type="number"
              placeholder="Amount"
              defaultValue={amount}
              onChange={e => setAmount(e.target.value)}
            ></input>
            &nbsp;{pair?.token0.symbol}
          </div>

          <div>
            <input
              className="s-input"
              type="number"
              placeholder="Limit price"
              defaultValue={limit}
              onChange={e => setLimit(e.target.value)}
            ></input>
            &nbsp;{pair?.token1.symbol}
          </div>
        </div>

        <div>
          Total : {amount * limit} {pair?.token1.symbol}{" "}
        </div>
        {orderType === "StopLoss" && (
          <div>
            <div className="slidecontainer">
              <input
                type="range"
                min="1"
                max="50"
                step="0.5"
                value={trigger}
                onChange={e => setTrigger(e.target.value)}
                className="slider"
              ></input>
              {/* {trigger} % */}
            </div>
            <div className="trigger-price">
              Trigger : {triggerPrice} {pair?.token1.symbol}
            </div>
          </div>
        )}

        {needApprove && (
          <div className="place-order">
            <button className="s-button" onClick={() => approve()}>
              Approve
            </button>
          </div>
        )}
        <div className="place-order">
          <button className="s-button" onClick={() => placeOrder()}>
            Place order
          </button>
        </div>
      </div>
    </div>
  );
};
