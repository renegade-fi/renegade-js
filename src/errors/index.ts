export enum RenegadeErrorType {
  RelayerUnreachable = "The provided Relayer URL is unreachable.",
  RelayerError = "The relayer returned a non-200 response.",
  RelayerTornDown = "The relayer has been torn down.",
  AccountAlreadyRegistered = "Account corresponding to this Keychain is already registered with the Renegade object.",
  AccountNotRegistered = "Provided AccountId is not registered with the Renegade object.",
  AccountNotSynced = "Account has not yet been synced. Call Account::sync() before using the Account.",
  CallbackNotRegistered = "Provided CallbackId does not correspond to a previously-registered callback.",
  InvalidHostname = "Provided hostname is not valid. Must be either a domain name, an IP address, or localhost.",
  InvalidPort = "Provided port is not valid. Must be an integer between 1 and 65535.",
  InvalidTaskId = "Provided TaskId is not valid.",
  BadParameters = "Parameters provided to the function are not valid.",
  MaxOrders = "The maximum number of active, unmatched orders has been reached.",
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
