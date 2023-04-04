export enum RenegadeErrorType {
  WalletAlreadyRegistered = "Wallet corresponding to this Keychain is already registered with the Renegade object.",
  WalletNotRegistered = "Provided WalletId is not registered with the Renegade object.",
  CallbackNotRegistered = "Provided CallbackId does not correspond to a previously-registered callback.",
  InvalidDomainName = "Provided domain name is not valid. Must be a string of the form 'example.com'.",
  InvalidPort = "Provided port is not valid. Must be an integer between 1 and 65535.",
}

export default class RenegadeError extends Error {
  constructor(renegadeErrorType: RenegadeErrorType, message?: string) {
    super(message || renegadeErrorType);
    (this.name = "RenegadeError"),
      // Restore the prototype chain. See
      // https://stackoverflow.com/questions/41102060/typescript-extending-error-class.
      Object.setPrototypeOf(this, new.target.prototype);
  }
}
