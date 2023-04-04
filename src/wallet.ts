import Keychain from "./keychain";

export default class Wallet {
  keychain: Keychain;
  constructor(keychain: Keychain) {
    this.keychain = keychain;
  }
}
