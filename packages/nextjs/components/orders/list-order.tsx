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
  const [user, setUser] = useState("");
  const { chain } = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    setChainId(chain?.id || 420);

    if (chain && signer) {
      getOrders().then;
    }

    if (signer) {
      signer.getAddress().then(r => setUser(r));
    }
  }, [chain, signer, pair]);

  const fEth = addresses.find(x => x.symbol === "fEth");
  const fLink = addresses.find(x => x.symbol === "fLink");
  const fUSDC = addresses.find(x => x.symbol === "fUSDC");
  const fBTC = addresses.find(x => x.symbol === "fBTC");
  const mEth = addresses.find(x => x.symbol === "mEth");

  const getOrders = async () => {
    try {
      const contractSelected = addresses.find(x => x.name === "Stop Loss");
      const address = contractSelected?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT0 = pair.token0?.addresses?.find(x => x.chainId === chainId)?.address;
      const addressT1 = pair.token1?.addresses?.find(x => x.chainId === chainId)?.address;
      if (address && signer) {
        const slContract = StopLoss__factory.connect(address, signer);
        // without subgraph
        const [orders, cursor] = await slContract.fetchPageOrders(0, 1000);
        console.log("orders", orders);
        if (addressT0) {
          const buy = orders.filter(
            x =>
              x.buyToken.toLowerCase() === addressT0.toLowerCase() &&
              x.sellToken.toLowerCase() == addressT1.toLowerCase(),
          );
          setBuyList(buy.map(x => new OrderData(x)));
        }
        if (addressT1) {
          const sell = orders.filter(
            x =>
              x.sellToken.toLowerCase() === addressT0.toLowerCase() &&
              x.buyToken.toLowerCase() == addressT1.toLowerCase(),
          );
          setSellList(sell.map(x => new OrderData(x)));
        }
      }
    } catch (error) {
      console.error("get allowance", error);
    }
  };

  function getDate(timestamp: number) {
    // timestamp in second convert to ms
    return new Date(timestamp * 1000).toLocaleString();
  }

  function getStatus(orderStatus: number) {
    switch (orderStatus) {
      case 1:
        return "Active";
      case 2:
        return "Canceled";
      case 3:
        return "Executed";
      default:
        return "Unknow";
    }
  }

  function getType(orderType: number) {
    switch (orderType) {
      case 1:
        return "Market";
      case 2:
        return "Limit";
      case 3:
        return "StopLoss";
      case 4:
        return "TrailingStop";
      default:
        return "Unknow";
    }
  }

  function isMine(buyer: string) {
    return user?.toLowerCase() === buyer?.toLowerCase();
  }

  return (
    <div className="order-list">
      <div>
        Pair {pair?.token0.name} - {pair?.token1.name}
      </div>
      <table>
        <tr>
          <th>Status</th>
          <th>Type</th>
          <th>
            Size <span className="info">{pair?.token0.symbol}</span>
          </th>
          <th>
            Price <span className="info">{pair?.token1.symbol}</span>
          </th>
          <th>
            Trigger <span className="info">{pair?.token1.symbol}</span>
          </th>
          <th>Date</th>
          <th>Mine</th>
          <th>Action</th>
        </tr>
        {buyList.map((el, index) => (
          <tr className="buy" key={index}>
            <td>{getStatus(el.orderStatus)}</td>
            <td>{getType(el.orderType)}</td>
            <td>{el.buyAmount}</td>
            <td>{el.sellAmount / el.buyAmount}</td>
            <td>{el.triggerPercent}</td>
            <td>{getDate(el.timestamp)}</td>
            <td>{isMine(el.buyer) ? "✓" : "-"}</td>
            <td>{isMine(el.buyer) && el.orderStatus === 1 && <button className="s-button">Cancel</button>}</td>
          </tr>
        ))}
        {sellList.map((el, index) => (
          <tr className="sell" key={index}>
            <td>{getStatus(el.orderStatus)}</td>
            <td>{getType(el.orderType)}</td>
            <td>{el.sellAmount}</td>
            <td>{el.buyAmount / el.sellAmount}</td>
            <td>{el.triggerPercent}</td>
            <td>{getDate(el.timestamp)}</td>
            <td>{isMine(el.buyer) ? "✓" : "-"}</td>
            <td>{isMine(el.buyer) && el.orderStatus === 1 && <button className="s-button">Cancel</button>}</td>
          </tr>
        ))}
      </table>
    </div>
  );
};
