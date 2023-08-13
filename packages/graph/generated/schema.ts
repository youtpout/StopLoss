// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Order extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Order entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Order must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Order", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Order | null {
    return changetype<Order | null>(
      store.get_in_block("Order", id.toHexString())
    );
  }

  static load(id: Bytes): Order | null {
    return changetype<Order | null>(store.get("Order", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get indexAll(): BigInt {
    let value = this.get("indexAll");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set indexAll(value: BigInt) {
    this.set("indexAll", Value.fromBigInt(value));
  }

  get sender(): Bytes {
    let value = this.get("sender");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set sender(value: Bytes) {
    this.set("sender", Value.fromBytes(value));
  }

  get sellToken(): Bytes {
    let value = this.get("sellToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set sellToken(value: Bytes) {
    this.set("sellToken", Value.fromBytes(value));
  }

  get buyToken(): Bytes {
    let value = this.get("buyToken");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set buyToken(value: Bytes) {
    this.set("buyToken", Value.fromBytes(value));
  }

  get index(): BigInt {
    let value = this.get("index");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set index(value: BigInt) {
    this.set("index", Value.fromBigInt(value));
  }

  get order_orderStatus(): i32 {
    let value = this.get("order_orderStatus");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set order_orderStatus(value: i32) {
    this.set("order_orderStatus", Value.fromI32(value));
  }

  get order_orderType(): i32 {
    let value = this.get("order_orderType");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set order_orderType(value: i32) {
    this.set("order_orderType", Value.fromI32(value));
  }

  get order_buyer(): Bytes {
    let value = this.get("order_buyer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set order_buyer(value: Bytes) {
    this.set("order_buyer", Value.fromBytes(value));
  }

  get order_timestamp(): BigInt {
    let value = this.get("order_timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set order_timestamp(value: BigInt) {
    this.set("order_timestamp", Value.fromBigInt(value));
  }

  get order_triggerPercent(): i32 {
    let value = this.get("order_triggerPercent");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set order_triggerPercent(value: i32) {
    this.set("order_triggerPercent", Value.fromI32(value));
  }

  get order_sellAmount(): BigInt {
    let value = this.get("order_sellAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set order_sellAmount(value: BigInt) {
    this.set("order_sellAmount", Value.fromBigInt(value));
  }

  get order_buyAmount(): BigInt {
    let value = this.get("order_buyAmount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set order_buyAmount(value: BigInt) {
    this.set("order_buyAmount", Value.fromBigInt(value));
  }

  get order_sellToComplete(): BigInt {
    let value = this.get("order_sellToComplete");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set order_sellToComplete(value: BigInt) {
    this.set("order_sellToComplete", Value.fromBigInt(value));
  }

  get order_buyToComplete(): BigInt {
    let value = this.get("order_buyToComplete");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set order_buyToComplete(value: BigInt) {
    this.set("order_buyToComplete", Value.fromBigInt(value));
  }

  get blockNumber(): BigInt {
    let value = this.get("blockNumber");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockNumber(value: BigInt) {
    this.set("blockNumber", Value.fromBigInt(value));
  }

  get blockTimestamp(): BigInt {
    let value = this.get("blockTimestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set blockTimestamp(value: BigInt) {
    this.set("blockTimestamp", Value.fromBigInt(value));
  }

  get transactionHash(): Bytes {
    let value = this.get("transactionHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set transactionHash(value: Bytes) {
    this.set("transactionHash", Value.fromBytes(value));
  }
}

export class Counter extends Entity {
  constructor(id: Bytes) {
    super();
    this.set("id", Value.fromBytes(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Counter entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.BYTES,
        `Entities of type Counter must have an ID of type Bytes but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Counter", id.toBytes().toHexString(), this);
    }
  }

  static loadInBlock(id: Bytes): Counter | null {
    return changetype<Counter | null>(
      store.get_in_block("Counter", id.toHexString())
    );
  }

  static load(id: Bytes): Counter | null {
    return changetype<Counter | null>(store.get("Counter", id.toHexString()));
  }

  get id(): Bytes {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set id(value: Bytes) {
    this.set("id", Value.fromBytes(value));
  }

  get all(): BigInt {
    let value = this.get("all");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set all(value: BigInt) {
    this.set("all", Value.fromBigInt(value));
  }

  get active(): BigInt {
    let value = this.get("active");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set active(value: BigInt) {
    this.set("active", Value.fromBigInt(value));
  }

  get sold(): BigInt {
    let value = this.get("sold");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set sold(value: BigInt) {
    this.set("sold", Value.fromBigInt(value));
  }

  get canceled(): BigInt {
    let value = this.get("canceled");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set canceled(value: BigInt) {
    this.set("canceled", Value.fromBigInt(value));
  }
}
