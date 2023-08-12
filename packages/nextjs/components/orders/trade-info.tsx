import { useEffect, useState } from "react";
import addresses from "../constants/addresses";
import { useNetwork } from "wagmi";

export const TradeInfo = ({ pair, buy }) => {
  return (
    <div className="trade-info">
      <div className="choose-order">
        <button className="selected">Limit</button>
        <button>Stop loss</button>
      </div>
      <div className="trade-content"></div>
    </div>
  );
};
