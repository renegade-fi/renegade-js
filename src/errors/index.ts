export enum RenegadeErrorType {
  RenegadeNotInitialized = "The Renegade object has not yet been initialized. Call Renegade::initialize() before using the Renegade object.",
  RelayerUnreachable = "The provided Relayer URL is unreachable.",
  AccountAlreadyRegistered = "Account corresponding to this Keychain is already registered with the Renegade object.",
  AccountNotRegistered = "Provided AccountId is not registered with the Renegade object.",
  AccountNotInitialized = "Account has not yet been initialized. Call Account::initialize() before using the Account.",
  CallbackNotRegistered = "Provided CallbackId does not correspond to a previously-registered callback.",
  InvalidHostname = "Provided hostname is not valid. Must be either a domain name, an IP address, or localhost.",
  InvalidPort = "Provided port is not valid. Must be an integer between 1 and 65535.",
}

export default class RenegadeError extends Error {
  constructor(renegadeErrorType: RenegadeErrorType, message?: string) {
    super(message ? renegadeErrorType + " " + message : renegadeErrorType);
    (this.name = "RenegadeError"),
      // Restore the prototype chain. See
      // https://stackoverflow.com/questions/41102060/typescript-extending-error-class.
      Object.setPrototypeOf(this, new.target.prototype);
  }
}
