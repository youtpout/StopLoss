import { useEffect, useState } from "react";
import addresses from "../constants/addresses";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { useNetwork } from "wagmi";
import { useEthersSigner } from "~~/services/ethers";
import { OrderData } from "~~/services/order-data";
import { StopLoss__factory, TestERC20__factory } from "~~/types/typechain-types";

export const ListOrder = ({ pair }) => {
  const [buyList, setBuyList] = useState<OrderData[]>([]);
  const [sellList, setSellList] = useState<OrderData[]>([]);
  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    setChainId(chain?.id || 420);

    if (chain && signer) {
      getOrders().then;
    }
  }, [chain, signer, pair]);

  const getOrders = async () => {
    try {
      const contractSelected = addresses.find(x => x.name === "Stop Loss");
      const address = contractSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT0 = pair.token0?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT1 = pair.token1?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const user = await signer.getAddress();
        const slContract = StopLoss__factory.connect(address, signer);
        // without subgraph
        const [orders, cursor] = await slContract.fetchPageOrders(0, 1000);
        if (addressT0) {
          const buy = orders.filter(x => x.buyToken.toLowerCase() === addressT0.toLowerCase());
          setBuyList(orders.map(x => new OrderData(x)));
        }
        if (addressT1) {
          const sell = orders.filter(x => x.sellToken.toLowerCase() === addressT1.toLowerCase());
          setSellList(sell);
        }
      }
    } catch (error) {
      console.error("get allowance", error);
    }
  };

  return (
    <div className="order-list">
      List
      <ul>
        {buyList.map((el, index) => (
          <li key={index}>{el.buyToken}</li>
        ))}
      </ul>
    </div>
  );
};
