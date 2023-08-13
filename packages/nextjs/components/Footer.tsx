import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import { useNetwork } from "wagmi";
import { hardhat } from "wagmi/chains";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { SwitchTheme } from "~~/components/SwitchTheme";
import { Faucet } from "~~/components/scaffold-eth";
import client from "~~/services/apollo";
import { useGlobalState } from "~~/services/store/store";
import { getTargetNetwork } from "~~/utils/scaffold-eth";

/**
 * Site footer
 */
export const Footer = () => {
  const nativeCurrencyPrice = useGlobalState(state => state.nativeCurrencyPrice);
  const [counters, setCounters] = useState();
  const [chainId, setChainId] = useState(420);
  const { chain } = useNetwork();

  useEffect(() => {
    // update data every 10 seconds
    const interval = setInterval(() => {
      countOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setChainId(chain?.id || 420);
  }, [chain]);

  const countOrders = async () => {
    const { data } = await client.query({
      query: gql`
        query MyQuery {
          counters {
            id
            all
            active
            canceled
            sold
          }
        }
      `,
    });

    let count = data?.counters?.find(x => x?.id === "0xe7030000");
    console.log("data", count);
    setCounters(count);
  };

  return (
    <div className="min-h-0 p-5 mb-11 lg:mb-0">
      <div>
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex space-x-2 pointer-events-auto">
            {nativeCurrencyPrice > 0 && (
              <div className="btn btn-primary btn-sm font-normal cursor-auto">
                <CurrencyDollarIcon className="h-4 w-4 mr-0.5" />
                <span>{nativeCurrencyPrice}</span>
              </div>
            )}
            {getTargetNetwork().id === hardhat.id && <Faucet />}
          </div>
          <SwitchTheme className="pointer-events-auto" />
        </div>
      </div>
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            {chain?.id === 420 && (
              <div className="stat-orders">
                <span>Total Orders : {counters?.all}</span>
                <span>Active Orders : {counters?.active}</span>
                <span>Canceled Orders : {counters?.canceled}</span>
                <span>Executed Orders : {counters?.sold}</span>
              </div>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};
