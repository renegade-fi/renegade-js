import Balance from "./balance";
import Fee from "./fee";
import Keychain from "./keychain";
import Order from "./order";
import { bigIntToLimbs, generateId, limbsToBigInt } from "./utils";
export default class Wallet {
    constructor(params) {
        this.walletId =
            params.id ||
                generateId(Buffer.from(params.keychain.keyHierarchy.view.publicKey.buffer));
        this.balances = params.balances;
        this.orders = params.orders;
        this.fees = params.fees;
        this.keychain = params.keychain;
        this.randomness = params.randomness;
    }
    serialize(asBigEndian) {
        return `{
      "id": "${this.walletId}",
      "balances": [${this.balances.map((b) => b.serialize()).join(",")}],
      "orders": [${this.orders.map((o) => o.serialize()).join(",")}],
      "fees": [${this.fees.map((f) => f.serialize()).join(",")}],
      "key_chain": ${this.keychain.serialize(asBigEndian)},
      "randomness": [${bigIntToLimbs(this.randomness).join(",")}]
    }`.replace(/[\s\n]/g, "");
    }
    static deserialize(serializedWallet, asBigEndian) {
        const id = serializedWallet.id;
        const balances = serializedWallet.balances.map((b) => Balance.deserialize(b));
        const orders = serializedWallet.orders.map((o) => Order.deserialize(o));
        const fees = serializedWallet.fees.map((f) => Fee.deserialize(f));
        const keychain = Keychain.deserialize(serializedWallet.key_chain, asBigEndian);
        const randomness = limbsToBigInt(serializedWallet.randomness);
        return new Wallet({ id, balances, orders, fees, keychain, randomness });
    }
}
