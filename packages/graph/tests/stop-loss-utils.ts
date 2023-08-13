import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Add,
  Cancel,
  Execute,
  Initialized,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/StopLoss/StopLoss"

export function createAddEvent(
  sender: Address,
  sellToken: Address,
  buyToken: Address,
  index: BigInt,
  order: ethereum.Tuple
): Add {
  let addEvent = changetype<Add>(newMockEvent())

  addEvent.parameters = new Array()

  addEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  addEvent.parameters.push(
    new ethereum.EventParam("sellToken", ethereum.Value.fromAddress(sellToken))
  )
  addEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken))
  )
  addEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  addEvent.parameters.push(
    new ethereum.EventParam("order", ethereum.Value.fromTuple(order))
  )

  return addEvent
}

export function createCancelEvent(
  sender: Address,
  sellToken: Address,
  buyToken: Address,
  index: BigInt,
  order: ethereum.Tuple
): Cancel {
  let cancelEvent = changetype<Cancel>(newMockEvent())

  cancelEvent.parameters = new Array()

  cancelEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("sellToken", ethereum.Value.fromAddress(sellToken))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("index", ethereum.Value.fromUnsignedBigInt(index))
  )
  cancelEvent.parameters.push(
    new ethereum.EventParam("order", ethereum.Value.fromTuple(order))
  )

  return cancelEvent
}

export function createExecuteEvent(
  sender: Address,
  sellToken: Address,
  buyToken: Address,
  indexA: BigInt,
  indexB: BigInt,
  orderA: ethereum.Tuple,
  orderB: ethereum.Tuple
): Execute {
  let executeEvent = changetype<Execute>(newMockEvent())

  executeEvent.parameters = new Array()

  executeEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("sellToken", ethereum.Value.fromAddress(sellToken))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("buyToken", ethereum.Value.fromAddress(buyToken))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("indexA", ethereum.Value.fromUnsignedBigInt(indexA))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("indexB", ethereum.Value.fromUnsignedBigInt(indexB))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("orderA", ethereum.Value.fromTuple(orderA))
  )
  executeEvent.parameters.push(
    new ethereum.EventParam("orderB", ethereum.Value.fromTuple(orderB))
  )

  return executeEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
