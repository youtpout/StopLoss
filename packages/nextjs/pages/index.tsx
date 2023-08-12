import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useNetwork } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { MintToken } from "~~/components/orders/mint-token";
import { PairChoice } from "~~/components/orders/pair-choice";
import { TradeInfo } from "~~/components/orders/trade-info";
import { useEthersSigner } from "~~/services/ethers";

const Home: NextPage = () => {
  const [pair, setPair] = useState();
  const [user, setUser] = useState("");

  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();
  const signer = useEthersSigner();

  useEffect(() => {
    setChainId(chain?.id || 420);
  }, [chain]);

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(r => setUser(r));
    } else {
      setUser("");
    }
  }, [signer]);

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
            <div className="home-status">
              {user && (
                <span title={user}>
                  Account {user.substring(0, 8)}...{user.substring(user.length - 8)}
                </span>
              )}
              {!user && <span>Not connected</span>}
            </div>
            <TradeInfo pair={undefined} buy={undefined}></TradeInfo>
            <MintToken></MintToken>
          </div>

          <div>
            {JSON.stringify(pair)}
            <button className="btn-transparent">Toto</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
