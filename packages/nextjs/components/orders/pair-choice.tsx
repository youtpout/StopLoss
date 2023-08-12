import { useEffect, useState } from "react";
import addresses from "../constants/addresses";

export const PairChoice = ({ selectedPair }) => {
  const [pair, setPair] = useState("fEth-fUSDC");

  const fEth = addresses.find(x => x.symbol === "fEth");
  const fLink = addresses.find(x => x.symbol === "fLink");
  const fUSDC = addresses.find(x => x.symbol === "fUSDC");
  const fBTC = addresses.find(x => x.symbol === "fBTC");
  const mEth = addresses.find(x => x.symbol === "mEth");

  const listTokens = [];
  listTokens.push("fEth-fUSDC");
  listTokens.push("fLink-fUSDC");
  listTokens.push("fBTC-fUSDC");
  listTokens.push("mEth-fUSDC");
  listTokens.push("fBTC-fEth");

  useEffect(() => {
    const data = pair.split("-");
    if (data.length > 1) {
      const token0 = addresses.find(x => x.symbol === data[0]);
      const token1 = addresses.find(x => x.symbol === data[1]);
      selectedPair({ token0, token1 });
    }
  }, [pair]);

  return (
    <div className="menu-tokens">
      <div>{pair.toUpperCase()}</div>
      <div className="tokens-content">
        {listTokens.map((el, index) => (
          <button key={index} onClick={() => setPair(el)}>
            {el.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};
