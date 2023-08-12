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
    contract: "erc20",
    name: "Fake Ether",
    symbol: "fEth",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0xb7672932294f0650c8c668B8c834596A620d27c1",
      },
    ],
  },
  {
    contract: "erc20",
    name: "Fake Link",
    symbol: "fLink",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0xBe2C7317968Ca44304Fa88ca52585d6dD8AAFF93",
      },
    ],
  },
  {
    contract: "erc20",
    name: "Fake USDC",
    symbol: "fUSDC",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0x3669CC9530dDD1283a9258DBC98A8011dE610A88",
      },
    ],
  },
  {
    contract: "erc20",
    name: "Fake Bitcoin",
    symbol: "fBTC",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0xB91da63f4403B3295eba6ea19822517AF41Bfa03",
      },
    ],
  },
  {
    contract: "erc20",
    name: "Manipulable Ether",
    symbol: "mEth",
    decimals: 18,
    addresses: [
      {
        chainId: 420,
        address: "0xB35d9E3A7f27982b7f0ABBEe731B109deeD5d2bc",
      },
    ],
  },
  {
    contract: "priceOracle",
    name: "Price oracle",
    addresses: [
      {
        chainId: 420,
        address: "0x2a6b481Af079aD10c945508Da5f44d13356dABc2",
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
