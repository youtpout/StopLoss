const addresses = [
  {
    contract: "erc20",
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    addresses: [
      {
        // optimism
        chainId: 420,
        address: "0x4200000000000000000000000000000000000006",
      },
      {
        // base
        chainId: 84531,
        address: "0x4200000000000000000000000000000000000006",
      },
      {
        // zora
        chainId: 999,
        address: "0x4200000000000000000000000000000000000006",
      },
      {
        // mode
        chainId: 919,
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
      {
        // base
        chainId: 84531,
        address: "0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3",
      },
      {
        // zora
        chainId: 999,
        address: "0xd4Cd74C9f559332511Da67425DBf553d479f87F4",
      },
      {
        // mode
        chainId: 919,
        address: "0x0022BeD2FFcDd3E18150157Fd28d845844B76723",
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
      {
        // base
        chainId: 84531,
        address: "0x6Ff9acFE5B23FA3a44C4979b5bd60A29B706C912",
      },
      {
        // zora
        chainId: 999,
        address: "0x0022BeD2FFcDd3E18150157Fd28d845844B76723",
      },
      {
        // mode
        chainId: 919,
        address: "0x74D5dd44c1af45D29D3b226581D212911C332e1e",
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
      {
        // base
        chainId: 84531,
        address: "0x91673a7567Ea046e98a8b909fF56f21b4E12eE40",
      },
      {
        // zora
        chainId: 999,
        address: "0x74D5dd44c1af45D29D3b226581D212911C332e1e",
      },
      {
        // mode
        chainId: 919,
        address: "0xcf987c488D5712ABb8689702D80970da674f31e3",
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
      {
        // base
        chainId: 84531,
        address: "0xA0a59C091E59E70C0cf17Fd43946C7e4D074B6F3",
      },
      {
        // zora
        chainId: 999,
        address: "0xcf987c488D5712ABb8689702D80970da674f31e3",
      },
      {
        // mode
        chainId: 919,
        address: "0x27aaBBA64f8F8e2aAF8B5885bBDB9c17a604e71B",
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
      {
        // base
        chainId: 84531,
        address: "0xbEE9a5c8B136b180E2822c82Ba62DC4496Edf1Ab",
      },
      {
        // zora
        chainId: 999,
        address: "0x27aaBBA64f8F8e2aAF8B5885bBDB9c17a604e71B",
      },
      {
        // mode
        chainId: 919,
        address: "0x13222C48eed0feCfCe16aA76670D2Cbb7f7B0b6F",
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
      {
        // base
        chainId: 84531,
        address: "0x0f97f954B07f425e2ADA71b83A7423F83765238c",
      },
      {
        // zora
        chainId: 999,
        address: "0x8B3cdFd5fE121cF8d782399B3acd800c5e6e88e2",
      },
      {
        // mode
        chainId: 919,
        address: "0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3",
      },
    ],
  },
  {
    contract: "stopLoss",
    name: "Stop Loss",
    addresses: [
      {
        chainId: 420,
        address: "0xDeEB811d79382b42eE60EDB8a204F5949d1169f4",
      },
      {
        // base
        chainId: 84531,
        address: "0xb7672932294f0650c8c668B8c834596A620d27c1",
      },
      {
        // zora
        chainId: 999,
        address: "0x6Ff9acFE5B23FA3a44C4979b5bd60A29B706C912",
      },
      {
        // mode
        chainId: 919,
        address: "0x91673a7567Ea046e98a8b909fF56f21b4E12eE40",
      },
    ],
  },
] as const;

export default addresses;
