import * as uuid from "uuid";
import Token from "./token";
import { bigIntToLimbsLE, limbsToBigIntLE } from "./utils";
export default class Order {
    constructor(params) {
        if (params.type === "midpoint") {
            throw new Error("Midpoint orders are not yet supported.");
        }
        this.orderId = params.id || uuid.v4();
        this.baseToken = params.baseToken;
        this.quoteToken = params.quoteToken;
        this.side = params.side;
        this.type = params.type;
        this.amount = params.amount;
        this.minimumAmount = params.minimumAmount;
        this.price = params.price;
        this.timestamp = params.timestamp || new Date().getTime();
    }
    pack() {
        // TODO: Figure out correct price encoding.
        return [
            BigInt("0x" + this.quoteToken.address),
            BigInt("0x" + this.baseToken.address),
            this.side === "buy" ? 0n : 1n,
            BigInt(Math.floor(this.price)),
            this.amount,
            BigInt(this.timestamp),
        ];
    }
    serialize() {
        let minimumAmountSerialized;
        if (this.minimumAmount) {
            minimumAmountSerialized = `[${bigIntToLimbsLE(this.minimumAmount).join(",")}]`;
        }
        else {
            minimumAmountSerialized = null;
        }
        return `{
      "id": "${this.orderId}",
      "base_mint": "${this.baseToken.serialize()}",
      "quote_mint": "${this.quoteToken.serialize()}",
      "side": "${this.side === "buy" ? "Buy" : "Sell"}",
      "type": "${this.type === "midpoint" ? "Midpoint" : "Limit"}",
      "amount": [${bigIntToLimbsLE(this.amount).join(",")}],
      "minimum_amount": ${minimumAmountSerialized},
      "worst_case_price": ${this.price || 0},
      "timestamp": ${this.timestamp}
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedOrder) {
        let minimumAmountDeserialized;
        if (serializedOrder.minimum_amount) {
            minimumAmountDeserialized = limbsToBigIntLE(serializedOrder.minimum_amount);
        }
        else {
            minimumAmountDeserialized = undefined;
        }
        let priceDeserialized = Number(serializedOrder.worst_case_price);
        if (priceDeserialized === 0) {
            priceDeserialized = undefined;
        }
        return new Order({
            id: serializedOrder.id,
            baseToken: Token.deserialize(serializedOrder.base_mint),
            quoteToken: Token.deserialize(serializedOrder.quote_mint),
            side: serializedOrder.side.toLowerCase(),
            type: serializedOrder.type.toLowerCase(),
            amount: limbsToBigIntLE(serializedOrder.amount),
            minimumAmount: minimumAmountDeserialized,
            price: priceDeserialized,
            timestamp: serializedOrder.timestamp,
        });
    }
}
