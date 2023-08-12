import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useNetwork } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { MintToken } from "~~/components/orders/mint-token";
import { PairChoice } from "~~/components/orders/pair-choice";
import { TradeInfo } from "~~/components/orders/trade-info";

const Home: NextPage = () => {
  const [pair, setPair] = useState();

  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();

  useEffect(() => {
    setChainId(chain?.id || 420);
  }, [chain]);

  return (
    <>
      <MetaHeader />
      <div className="home">
        <div className="home-header">
          <div className="home-pair">
            <PairChoice selectedPair={setPair}></PairChoice>
          </div>
        </div>
        <div className="home-content">
          <div className="home-menu">
            <TradeInfo pair={undefined} buy={undefined}></TradeInfo>
            <MintToken></MintToken>
          </div>
          <div>{JSON.stringify(pair)}</div>
        </div>
      </div>
    </>
  );
};

export default Home;
