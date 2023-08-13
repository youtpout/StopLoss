import { ethers } from "ethers";
import { StopLoss } from "~~/types/typechain-types";

export class OrderData {
  sellToken: string;
  buyToken: string;
  index: number;
  orderStatus: number;
  orderType: number;
  buyer: string;
  timestamp: number;
  triggerPercent: number;
  sellAmount: number;
  buyAmount: number;
  sellToComplete: number;
  buyToComplete: number;

  constructor(order: StopLoss.OrderDataStructOutput) {
    this.sellToken = order.sellToken;
    this.buyToken = order.buyToken;
    this.index = order.index.toNumber();
    this.orderStatus = order.order.orderStatus;
    this.orderType = order.order.orderType;
    this.buyer = order.order.buyer;
    this.timestamp = order.order.timestamp;
    this.triggerPercent = order.order.triggerPercent;
    this.sellAmount = ethers.utils.formatEther(order.order.sellAmount);
    this.buyAmount = ethers.utils.formatEther(order.order.buyAmount);
    this.sellToComplete = ethers.utils.formatEther(order.order.sellToComplete);
    this.buyToComplete = ethers.utils.formatEther(order.order.buyToComplete);
  }
}
