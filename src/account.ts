import Keychain from "./keychain";

export default class Account {
  keychain: Keychain;
  constructor(keychain: Keychain) {
    this.keychain = keychain;
  }
}
