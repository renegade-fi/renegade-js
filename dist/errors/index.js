export var RenegadeErrorType;
(function (RenegadeErrorType) {
    RenegadeErrorType["RelayerUnreachable"] = "The provided Relayer URL is unreachable.";
    RenegadeErrorType["RelayerError"] = "The relayer returned a non-200 response.";
    RenegadeErrorType["RelayerTornDown"] = "The relayer has been torn down.";
    RenegadeErrorType["AccountAlreadyRegistered"] = "Account corresponding to this Keychain is already registered with the Renegade object.";
    RenegadeErrorType["AccountNotRegistered"] = "Provided AccountId is not registered with the Renegade object.";
    RenegadeErrorType["AccountNotSynced"] = "Account has not yet been synced. Call Account::sync() before using the Account.";
    RenegadeErrorType["CallbackNotRegistered"] = "Provided CallbackId does not correspond to a previously-registered callback.";
    RenegadeErrorType["InvalidHostname"] = "Provided hostname is not valid. Must be either a domain name, an IP address, or localhost.";
    RenegadeErrorType["InvalidPort"] = "Provided port is not valid. Must be an integer between 1 and 65535.";
    RenegadeErrorType["InvalidTaskId"] = "Provided TaskId is not valid.";
    RenegadeErrorType["BadParameters"] = "Parameters provided to the function are not valid.";
    RenegadeErrorType["MaxOrders"] = "The maximum number of active, unmatched orders has been reached.";
})(RenegadeErrorType || (RenegadeErrorType = {}));
export default class RenegadeError extends Error {
    constructor(renegadeErrorType, message) {
        super(message ? renegadeErrorType + " " + message : renegadeErrorType);
        (this.name = "RenegadeError"),
            // Restore the prototype chain. See
            // https://stackoverflow.com/questions/41102060/typescript-extending-error-class.
            Object.setPrototypeOf(this, new.target.prototype);
    }
}
