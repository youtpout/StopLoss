import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Add as AddEvent,
  Cancel as CancelEvent,
  Execute as ExecuteEvent,
  Initialized as InitializedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent
} from "../generated/StopLoss/StopLoss"
import {
  Order,
  Counter,

} from "../generated/schema"

export function handleAdd(event: AddEvent): void {
  let index = updateCount(event.params.order.orderType,event.params.order.orderStatus);
  
  let hash = getHash(event.params.sellToken,event.params.buyToken,event.params.index);
  let entity = new Order(hash);
  entity.sender = event.params.sender
  entity.sellToken = event.params.sellToken
  entity.buyToken = event.params.buyToken
  entity.index = event.params.index
  entity.indexAll = index
  entity.order_orderStatus = event.params.order.orderStatus
  entity.order_orderType = event.params.order.orderType
  entity.order_buyer = event.params.order.buyer
  entity.order_timestamp = event.params.order.timestamp
  entity.order_triggerPercent = event.params.order.triggerPercent
  entity.order_sellAmount = event.params.order.sellAmount
  entity.order_buyAmount = event.params.order.buyAmount
  entity.order_sellToComplete = event.params.order.sellToComplete
  entity.order_buyToComplete = event.params.order.buyToComplete

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

function getHash(sellToken:Address,buyToken:Address,index:BigInt) :Bytes{
  return Bytes.fromHexString(sellToken.toHexString())
  .concat(Bytes.fromHexString(buyToken.toHexString()))
  .concat(Bytes.fromBigInt(index));
}

export function handleCancel(event: CancelEvent): void {
  let hash = getHash(event.params.sellToken,event.params.buyToken,event.params.index);

  let entity = Order.load(hash)!;

  entity.sender = event.params.sender
  entity.sellToken = event.params.sellToken
  entity.buyToken = event.params.buyToken
  entity.index = event.params.index
  entity.order_orderStatus = event.params.order.orderStatus
  entity.order_orderType = event.params.order.orderType
  entity.order_buyer = event.params.order.buyer
  entity.order_timestamp = event.params.order.timestamp
  entity.order_triggerPercent = event.params.order.triggerPercent
  entity.order_sellAmount = event.params.order.sellAmount
  entity.order_buyAmount = event.params.order.buyAmount
  entity.order_sellToComplete = event.params.order.sellToComplete
  entity.order_buyToComplete = event.params.order.buyToComplete

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleExecute(event: ExecuteEvent): void {
  let hash = getHash(event.params.sellToken,event.params.buyToken,event.params.index);

  let entity = Order.load(hash)!;

  entity.sender = event.params.sender
  entity.sellToken = event.params.sellToken
  entity.buyToken = event.params.buyToken
  entity.indexA = event.params.indexA
  entity.indexB = event.params.indexB
  entity.orderA_orderStatus = event.params.orderA.orderStatus
  entity.orderA_orderType = event.params.orderA.orderType
  entity.orderA_buyer = event.params.orderA.buyer
  entity.orderA_timestamp = event.params.orderA.timestamp
  entity.orderA_triggerPercent = event.params.orderA.triggerPercent
  entity.orderA_sellAmount = event.params.orderA.sellAmount
  entity.orderA_buyAmount = event.params.orderA.buyAmount
  entity.orderA_sellToComplete = event.params.orderA.sellToComplete
  entity.orderA_buyToComplete = event.params.orderA.buyToComplete
  entity.orderB_orderStatus = event.params.orderB.orderStatus
  entity.orderB_orderType = event.params.orderB.orderType
  entity.orderB_buyer = event.params.orderB.buyer
  entity.orderB_timestamp = event.params.orderB.timestamp
  entity.orderB_triggerPercent = event.params.orderB.triggerPercent
  entity.orderB_sellAmount = event.params.orderB.sellAmount
  entity.orderB_buyAmount = event.params.orderB.buyAmount
  entity.orderB_sellToComplete = event.params.orderB.sellToComplete
  entity.orderB_buyToComplete = event.params.orderB.buyToComplete

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


function updateCount(type: i32,status: i32): BigInt {  
  // get counter by type and for all
  let entity = Counter.load(Bytes.fromI32(type));
  if (entity == null) {
    entity = new Counter(Bytes.fromI32(type));
  }
 
  saveCounter(entity,status);

  let entityAll = Counter.load(Bytes.fromI32(999));
  if (entityAll == null) {
    entityAll = new Counter(Bytes.fromI32(999));
  }
  saveCounter(entityAll,status);

  return entityAll.all;
}

function saveCounter(entity:Counter, status:i32){
  switch (status) {
    case 1:
      entity.active = entity.active.plus(BigInt.fromI32(1));
      entity.all = entity.all.plus(BigInt.fromI32(1));
      break;
    case 2:
      entity.active = entity.active.minus(BigInt.fromI32(1));
      entity.canceled = entity.canceled.plus(BigInt.fromI32(1));
      break;
    case 3:
      entity.active = entity.active.minus(BigInt.fromI32(1));
      entity.sold = entity.sold.plus(BigInt.fromI32(1));
      break;
  }
  entity.save();

}
