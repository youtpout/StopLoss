/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  TestERC20,
  TestERC20Interface,
} from "../../../contracts/TestERC20.sol/TestERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801562000010575f80fd5b5060405162000def38038062000def83398101604081905262000033916200018a565b818160036200004383826200027c565b5060046200005282826200027c565b5050506200006f620000696200007760201b60201c565b6200007b565b505062000344565b3390565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b634e487b7160e01b5f52604160045260245ffd5b5f82601f830112620000f0575f80fd5b81516001600160401b03808211156200010d576200010d620000cc565b604051601f8301601f19908116603f01168101908282118183101715620001385762000138620000cc565b8160405283815260209250868385880101111562000154575f80fd5b5f91505b8382101562000177578582018301518183018401529082019062000158565b5f93810190920192909252949350505050565b5f80604083850312156200019c575f80fd5b82516001600160401b0380821115620001b3575f80fd5b620001c186838701620000e0565b93506020850151915080821115620001d7575f80fd5b50620001e685828601620000e0565b9150509250929050565b600181811c908216806200020557607f821691505b6020821081036200022457634e487b7160e01b5f52602260045260245ffd5b50919050565b601f82111562000277575f81815260208120601f850160051c81016020861015620002525750805b601f850160051c820191505b8181101562000273578281556001016200025e565b5050505b505050565b81516001600160401b03811115620002985762000298620000cc565b620002b081620002a98454620001f0565b846200022a565b602080601f831160018114620002e6575f8415620002ce5750858301515b5f19600386901b1c1916600185901b17855562000273565b5f85815260208120601f198616915b828110156200031657888601518255948401946001909101908401620002f5565b50858210156200033457878501515f19600388901b60f8161c191681555b5050505050600190811b01905550565b610a9d80620003525f395ff3fe608060405234801561000f575f80fd5b50600436106100f0575f3560e01c806370a0823111610093578063a457c2d711610063578063a457c2d7146101e4578063a9059cbb146101f7578063dd62ed3e1461020a578063f2fde38b1461021d575f80fd5b806370a0823114610191578063715018a6146101b95780638da5cb5b146101c157806395d89b41146101dc575f80fd5b806323b872dd116100ce57806323b872dd14610147578063313ce5671461015a578063395093511461016957806340c10f191461017c575f80fd5b806306fdde03146100f4578063095ea7b31461011257806318160ddd14610135575b5f80fd5b6100fc610230565b6040516101099190610921565b60405180910390f35b610125610120366004610987565b6102c0565b6040519015158152602001610109565b6002545b604051908152602001610109565b6101256101553660046109af565b6102d9565b60405160128152602001610109565b610125610177366004610987565b6102fc565b61018f61018a366004610987565b61031d565b005b61013961019f3660046109e8565b6001600160a01b03165f9081526020819052604090205490565b61018f61032b565b6005546040516001600160a01b039091168152602001610109565b6100fc61033e565b6101256101f2366004610987565b61034d565b610125610205366004610987565b6103cc565b610139610218366004610a08565b6103d9565b61018f61022b3660046109e8565b610403565b60606003805461023f90610a39565b80601f016020809104026020016040519081016040528092919081815260200182805461026b90610a39565b80156102b65780601f1061028d576101008083540402835291602001916102b6565b820191905f5260205f20905b81548152906001019060200180831161029957829003601f168201915b5050505050905090565b5f336102cd81858561047c565b60019150505b92915050565b5f336102e685828561059f565b6102f1858585610617565b506001949350505050565b5f336102cd81858561030e83836103d9565b6103189190610a71565b61047c565b61032782826107b9565b5050565b610333610876565b61033c5f6108d0565b565b60606004805461023f90610a39565b5f338161035a82866103d9565b9050838110156103bf5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102f1828686840361047c565b5f336102cd818585610617565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b61040b610876565b6001600160a01b0381166104705760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016103b6565b610479816108d0565b50565b6001600160a01b0383166104de5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103b6565b6001600160a01b03821661053f5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103b6565b6001600160a01b038381165f8181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b5f6105aa84846103d9565b90505f19811461061157818110156106045760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103b6565b610611848484840361047c565b50505050565b6001600160a01b03831661067b5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103b6565b6001600160a01b0382166106dd5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103b6565b6001600160a01b0383165f90815260208190526040902054818110156107545760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103b6565b6001600160a01b038481165f81815260208181526040808320878703905593871680835291849020805487019055925185815290927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a3610611565b6001600160a01b03821661080f5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103b6565b8060025f8282546108209190610a71565b90915550506001600160a01b0382165f81815260208181526040808320805486019055518481527fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef910160405180910390a35050565b6005546001600160a01b0316331461033c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016103b6565b600580546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0905f90a35050565b5f6020808352835180828501525f5b8181101561094c57858101830151858201604001528201610930565b505f604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610982575f80fd5b919050565b5f8060408385031215610998575f80fd5b6109a18361096c565b946020939093013593505050565b5f805f606084860312156109c1575f80fd5b6109ca8461096c565b92506109d86020850161096c565b9150604084013590509250925092565b5f602082840312156109f8575f80fd5b610a018261096c565b9392505050565b5f8060408385031215610a19575f80fd5b610a228361096c565b9150610a306020840161096c565b90509250929050565b600181811c90821680610a4d57607f821691505b602082108103610a6b57634e487b7160e01b5f52602260045260245ffd5b50919050565b808201808211156102d357634e487b7160e01b5f52601160045260245ffdfea164736f6c6343000814000a";

type TestERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestERC20__factory extends ContractFactory {
  constructor(...args: TestERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestERC20> {
    return super.deploy(name, symbol, overrides || {}) as Promise<TestERC20>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override attach(address: string): TestERC20 {
    return super.attach(address) as TestERC20;
  }
  override connect(signer: Signer): TestERC20__factory {
    return super.connect(signer) as TestERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestERC20Interface {
    return new utils.Interface(_abi) as TestERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestERC20 {
    return new Contract(address, _abi, signerOrProvider) as TestERC20;
  }
}
