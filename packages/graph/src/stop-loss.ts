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
  updateCount(event.params.order.orderType,event.params.order.orderStatus);
  let entityAll = Counter.load(Bytes.fromI32(999));
  let index = BigInt.fromI32(0);
  if(entityAll){
    index = entityAll.all;
  }
  
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

  entity.save()
}

function getHash(sellToken:Address,buyToken:Address,index:BigInt) :Bytes{
 return Bytes.fromHexString(sellToken.toHexString())
  .concat(Bytes.fromHexString(buyToken.toHexString()))
  .concat(Bytes.fromHexString(index.toHexString()+"1"))
// +1 can't hash 0 index
}

export function handleCancel(event: CancelEvent): void {
  let hash = getHash(event.params.sellToken,event.params.buyToken,event.params.index)

  let entity = Order.load(hash)!

  entity.order_orderStatus = event.params.order.orderStatus
  entity.order_sellToComplete = event.params.order.sellToComplete
  entity.order_buyToComplete = event.params.order.buyToComplete

  entity.save()
}

export function handleExecute(event: ExecuteEvent): void {
  let hashA = getHash(event.params.sellToken,event.params.buyToken,event.params.indexA);
  let hashB = getHash(event.params.sellToken,event.params.buyToken,event.params.indexB);
  let entityA = Order.load(hashA)!;
  let entityB = Order.load(hashB)!;

  entityA.order_orderStatus = event.params.orderA.orderStatus
  entityA.order_sellToComplete = event.params.orderA.sellToComplete
  entityA.order_buyToComplete = event.params.orderA.buyToComplete

  entityB.order_orderStatus = event.params.orderB.orderStatus
  entityB.order_sellToComplete = event.params.orderB.sellToComplete
  entityB.order_buyToComplete = event.params.orderB.buyToComplete

  entityA.save()
  entityB.save()
}


function updateCount(orderType: i32,status: i32) :void {  
  // get counter by type and for all
  let entity = Counter.load(Bytes.fromI32(orderType));
  if (entity == null) {
    entity = new Counter(Bytes.fromI32(orderType));
    entity.all = BigInt.fromI32(0);
    entity.active = BigInt.fromI32(0);
    entity.canceled = BigInt.fromI32(0);
    entity.sold = BigInt.fromI32(0);
  }
 
  saveCounter(entity,status);

  let entityAll = Counter.load(Bytes.fromI32(999));
  if (entityAll == null) {
    entityAll = new Counter(Bytes.fromI32(999));
    entityAll.all = BigInt.fromI32(0);
    entityAll.active = BigInt.fromI32(0);
    entityAll.canceled = BigInt.fromI32(0);
    entityAll.sold = BigInt.fromI32(0);
  }
  let index = entityAll.all;
  saveCounter(entityAll,status);
}

function saveCounter(entity:Counter, status:i32):void{
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
