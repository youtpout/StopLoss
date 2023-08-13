# 🏗 StopLoss

## Optimism testnet address

Fake Ether 0xb7672932294f0650c8c668B8c834596A620d27c1

Fake Link 0xBe2C7317968Ca44304Fa88ca52585d6dD8AAFF93

Fake USDC 0x3669CC9530dDD1283a9258DBC98A8011dE610A88

Fake Bitcoin 0xB91da63f4403B3295eba6ea19822517AF41Bfa03

Manipulable Ether 0xB35d9E3A7f27982b7f0ABBEe731B109deeD5d2bc

PriceFeedEthMock 0xdEa0F6213B346fBAB757E60949D819cD846748a3

price Oracle 0x2a6b481Af079aD10c945508Da5f44d13356dABc2

StopLoss 0xDeEB811d79382b42eE60EDB8a204F5949d1169f4

npx hardhat verify --constructor-args scripts/arg-feth.ts --network optimismGoerli 0xb7672932294f0650c8c668B8c834596A620d27c1 

npx hardhat verify --network optimismGoerli 0xdEa0F6213B346fBAB757E60949D819cD846748a3

npx hardhat verify --network optimismGoerli 0x0BAf2a63a033C5CE873f5D8c12390B541B20d909

npx hardhat verify --network optimismGoerli 0x13222C48eed0feCfCe16aA76670D2Cbb7f7B0b6F

##  Base testnet

how to deploy from hardhat repository (you need foundry installed)

npx hardhat run ./scripts/deploy-base.ts --network baseGoerli

Fake Ether 0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3

Fake Link 0x6Ff9acFE5B23FA3a44C4979b5bd60A29B706C912

Fake USDC 0x91673a7567Ea046e98a8b909fF56f21b4E12eE40

Fake Bitcoin 0xA0a59C091E59E70C0cf17Fd43946C7e4D074B6F3

Manipulable Ether 0xbEE9a5c8B136b180E2822c82Ba62DC4496Edf1Ab

PriceFeedEthMock 0xA8fEd8D3f8511f7ac0b1e7148dC66aC8f7Ee883A

price Oracle 0x0f97f954B07f425e2ADA71b83A7423F83765238c

StopLoss 0xb7672932294f0650c8c668B8c834596A620d27c1

npx hardhat verify --constructor-args scripts/arg-feth.ts --network baseGoerli 0x337BbD7c2b4D31d4431685b30B55735D8c0cc2B3 

npx hardhat verify --network baseGoerli 0xA8fEd8D3f8511f7ac0b1e7148dC66aC8f7Ee883A

npx hardhat verify --network baseGoerli 0xb2b4bca5393aacff636df436172b256b6d4325b3 

npx hardhat verify --network baseGoerli 0x13222c48eed0fecfce16aa76670d2cbb7f7b0b6f


### Subgraph

npm install -g @graphprotocol/graph-cli

folder location /packages/graph

execute installation on the folder
```npm i```

https://api.thegraph.com/subgraphs/name/youtpout/stoplossgoptimism