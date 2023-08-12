import { useEffect, useState } from "react";
import addresses from "../constants/addresses";
import { useNetwork } from "wagmi";

export const TradeInfo = ({ pair, buy }) => {
  const [orderType, setOrderType] = useState("Limit");

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
        {orderType === "Limit" && <span>Limit</span>}
        {orderType === "StopLoss" && <span>Stop Loss</span>}
      </div>
    </div>
  );
};
