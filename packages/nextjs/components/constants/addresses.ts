const addresses = [
  {
    contract: "erc20",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0x4200000000000000000000000000000000000006",
      },
    ],
  },
  {
    contract: "stopLoss",
    name: "Stop Loss",
    addresses: [
      {
        chainId: 420,
        address: "0x6e5aca3b88fc0816b52557549bf998fced333893",
      },
    ],
  },
] as const;

export default addresses;
