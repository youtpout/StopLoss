import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { Add } from "../generated/schema"
import { Add as AddEvent } from "../generated/StopLoss/StopLoss"
import { handleAdd } from "../src/stop-loss"
import { createAddEvent } from "./stop-loss-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let sender = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let sellToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let buyToken = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let index = BigInt.fromI32(234)
    let order = "ethereum.Tuple Not implemented"
    let newAddEvent = createAddEvent(sender, sellToken, buyToken, index, order)
    handleAdd(newAddEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Add created and stored", () => {
    assert.entityCount("Add", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Add",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sender",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Add",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "sellToken",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Add",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyToken",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Add",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "index",
      "234"
    )
    assert.fieldEquals(
      "Add",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "order",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
