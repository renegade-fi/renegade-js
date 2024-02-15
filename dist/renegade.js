var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import axios from "axios";
import Account from "./account";
import RenegadeError, { RenegadeErrorType } from "./errors";
import { GetExchangeHealthStatesResponse, parseExchangeHealthStates, } from "./types/schema";
import { RenegadeWs, createZodFetcher, unimplemented, } from "./utils";
/**
 * A decorator that asserts that the relayer has not been torn down.
 *
 * @throws {RelayerTornDown} If the relayer has been torn down.
 */
function assertNotTornDown(_target, _propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        if (this._isTornDown) {
            throw new RenegadeError(RenegadeErrorType.RelayerTornDown);
        }
        return originalMethod.apply(this, args);
    };
}
/**
 * The Renegade object is the primary method of interacting with the Renegade
 * relayer.
 */
export default class Renegade {
    // --------------------------
    // | State and Constructors |
    // --------------------------
    // Fully-qualified URL of the relayer HTTP API.
    relayerHttpUrl;
    // Fully-qualified URL of the relayer WebSocket API.
    relayerWsUrl;
    // Print verbose output.
    _verbose;
    // Number of milliseconds to sleep before returning from any task.
    _taskDelay;
    // The WebSocket connection to the relayer.
    _ws;
    // All Accounts that have been registered with the Renegade object.
    _registeredAccounts;
    // If true, the relayer has been torn down and is no longer usable.
    _isTornDown;
    /**
     * Construct a new Renegade object.
     *
     * @param config Configuration parameters for the Renegade object.
     *
     * @throws {InvalidHostname} If the hostname is not a valid hostname.
     * @throws {InvalidPort} If the port is not a valid port.
     */
    constructor(config) {
        // console.log("[FROM SDK] Constructing Renegade object with config: ", config)
        // Set defaults, if not provided.
        config.relayerHttpPort =
            config.relayerHttpPort !== undefined ? config.relayerHttpPort : 3000;
        config.relayerWsPort =
            config.relayerWsPort !== undefined ? config.relayerWsPort : 4000;
        config.useInsecureTransport = config.useInsecureTransport || false;
        this._verbose = config.verbose || false;
        this._taskDelay = config.taskDelay || 0;
        // Construct the URLs and save them.
        if (config.relayerHostname === "localhost") {
            config.relayerHostname = "127.0.0.1";
        }
        this.relayerHttpUrl = this._constructUrl("http", config.relayerHostname, config.relayerHttpPort, config.useInsecureTransport);
        this.relayerWsUrl = this._constructUrl("ws", config.relayerHostname, config.relayerWsPort, config.useInsecureTransport);
        this._ws = new RenegadeWs(this.relayerWsUrl, this._verbose);
        this._registeredAccounts = {};
        this._isTornDown = false;
        // Dynamically import renegade-utils WASM package if running in a browser
        if (typeof window !== "undefined" && typeof document !== "undefined") {
            import("../renegade-utils").then(module => {
                const loadUtils = module.default;
                loadUtils();
            }).catch(error => {
                console.error("Failed to load utilities:", error);
            });
        }
    }
    modifyOrPlaceOrder(accountId, order) {
        throw new Error("Method not implemented.");
    }
    /**
     * Construct a URL from the given parameters.
     *
     * @param protocol Either "http" or "ws".
     * @param hostname The hostname of the URL to construct.
     * @param port The port of the URL to construct.
     * @param useInsecureTransport If true, use http:// or ws:// instead of https:// or wss://.
     * @returns The constructed URL.
     *
     * @throws {InvalidHostname} If the hostname is not a valid hostname.
     * @throws {InvalidPort} If the port is not a valid port.
     */
    _constructUrl(protocol, hostname, port, useInsecureTransport) {
        const hostnameRegex = /^(?!:\/\/)((([a-zA-Z0-9-]{1,63}\.?)+[a-zA-Z]{2,63})|(?:\d{1,3}\.){3}\d{1,3})$/;
        if (!hostnameRegex.test(hostname)) {
            throw new RenegadeError(RenegadeErrorType.InvalidHostname, "Invalid hostname: " + hostname);
        }
        if (port < 1 || port > 65535 || !Number.isInteger(port)) {
            throw new RenegadeError(RenegadeErrorType.InvalidPort, "Invalid port: " + port);
        }
        return (protocol +
            (useInsecureTransport ? "" : "s") +
            "://" +
            hostname +
            ":" +
            port);
    }
    // -------------
    // | Utilities |
    // -------------
    /**
     * Ping the relayer to check if it is reachable.
     */
    async ping() {
        const request = {
            method: "GET",
            url: `${this.relayerHttpUrl}/v0/ping`,
            validateStatus: () => true,
        };
        let response;
        try {
            response = await axios.request(request);
        }
        catch (e) {
            throw new RenegadeError(RenegadeErrorType.RelayerUnreachable, this.relayerHttpUrl);
        }
        if (response.status !== 200 || !response.data.timestamp) {
            throw new RenegadeError(RenegadeErrorType.RelayerUnreachable, this.relayerHttpUrl);
        }
    }
    async queryExchangeHealthStates(baseToken, quoteToken) {
        const fetchWithZod = createZodFetcher(axios.request);
        const request = {
            method: "POST",
            url: `${this.relayerHttpUrl}/v0/exchange/health_check`,
            data: `{"base_token": {"addr": "${baseToken.serialize()}"}, "quote_token": {"addr": "${quoteToken.serialize()}"}}`,
        };
        let response;
        try {
            await fetchWithZod(GetExchangeHealthStatesResponse, request).then((res) => (response = res));
        }
        catch (e) {
            throw new RenegadeError(RenegadeErrorType.RelayerError);
        }
        return parseExchangeHealthStates(response.data);
    }
    async queryOrders() {
        const request = {
            method: "GET",
            url: `${this.relayerHttpUrl}/v0/order_book/orders`,
            validateStatus: () => true,
        };
        let response;
        try {
            await axios.request(request).then((res) => (response = res.data));
        }
        catch (e) {
            throw new RenegadeError(RenegadeErrorType.RelayerError, String(e));
        }
        return response;
    }
    async queryWallet(accountId) {
        const account = this._lookupAccount(accountId);
        return await account.queryWallet();
    }
    async queryTaskQueue(accountId) {
        const account = this._lookupAccount(accountId);
        return await account.queryTaskQueue();
    }
    /**
     * Get the semver of the relayer.
     */
    async getVersion() {
        unimplemented();
    }
    _lookupAccount(accountId) {
        const account = this._registeredAccounts[accountId];
        if (!account) {
            throw new RenegadeError(RenegadeErrorType.AccountNotRegistered, "Account not registered: " + accountId);
        }
        return account;
    }
    async awaitTaskCompletion(taskId) {
        await this._ws.awaitTaskCompletion(taskId);
        if (this._taskDelay > 0) {
            await new Promise((resolve) => setTimeout(resolve, this._taskDelay));
        }
    }
    async teardown() {
        for (const accountId in this._registeredAccounts) {
            await this.unregisterAccount(accountId);
        }
        this._ws.teardown();
        this._isTornDown = true;
    }
    // -----------------------------------
    // | IRenegadeAccount Implementation |
    // -----------------------------------
    registerAccount(keychain) {
        // console.log("[FROM SDK] Registering account with keychain: ", keychain)
        const account = new Account(keychain, this.relayerHttpUrl, this.relayerWsUrl, this._verbose);
        // console.log("[FROM SDK] Registered accounts: ", this._registeredAccounts)
        const accountId = account.accountId;
        if (this._registeredAccounts[accountId]) {
            throw new RenegadeError(RenegadeErrorType.AccountAlreadyRegistered);
        }
        this._registeredAccounts[accountId] = account;
        return accountId;
    }
    async initializeAccount(accountId) {
        // console.log("[FROM SDK] Initializing account: ", accountId)
        const [, taskJob] = await this._initializeAccountTaskJob(accountId);
        return await taskJob;
    }
    async _initializeAccountTaskJob(accountId) {
        const account = this._lookupAccount(accountId);
        return await account.sync();
    }
    async unregisterAccount(accountId) {
        const account = this._lookupAccount(accountId);
        account.teardown();
        delete this._registeredAccounts[accountId];
    }
    async delegateAccount(accountId, sendRoot) {
        unimplemented();
    }
    // ---------------------------------------
    // | IRenegadeInformation Implementation |
    // ---------------------------------------
    getBalances(accountId) {
        const account = this._lookupAccount(accountId);
        return account.balances;
    }
    getOrders(accountId) {
        const account = this._lookupAccount(accountId);
        return account.orders;
    }
    getFees(accountId) {
        const account = this._lookupAccount(accountId);
        return account.fees;
    }
    getKeychain(accountId) {
        const account = this._lookupAccount(accountId);
        return account.keychain;
    }
    getIsLocked(accountId) {
        const account = this._lookupAccount(accountId);
        return account.isLocked;
    }
    // -----------------------------------
    // | IRenegadeBalance Implementation |
    // -----------------------------------
    async deposit(accountId, mint, amount, fromAddr) {
        const [, taskJob] = await this._depositTaskJob(accountId, mint, amount, fromAddr);
        return await taskJob;
    }
    async _depositTaskJob(accountId, mint, amount, fromAddr) {
        const account = this._lookupAccount(accountId);
        // console.log("[SDK]: account: ", account)
        const taskId = await account.deposit(mint, amount, fromAddr);
        return [taskId, this.awaitTaskCompletion(taskId)];
    }
    async withdraw(accountId, mint, amount, destinationAddr) {
        const [, taskJob] = await this._withdrawTaskJob(accountId, mint, amount, destinationAddr);
        return await taskJob;
    }
    async _withdrawTaskJob(accountId, mint, amount, destinationAddr) {
        const account = this._lookupAccount(accountId);
        const taskId = await account.withdraw(mint, amount, destinationAddr);
        return [taskId, this.awaitTaskCompletion(taskId)];
    }
    // -----------------------------------
    // | IRenegadeTrading Implementation |
    // -----------------------------------
    async placeOrder(accountId, order) {
        const [, taskJob] = await this._placeOrderTaskJob(accountId, order);
        return await taskJob;
    }
    async _placeOrderTaskJob(accountId, order) {
        const account = this._lookupAccount(accountId);
        const taskId = await account.placeOrder(order);
        return [taskId, this.awaitTaskCompletion(taskId)];
    }
    async modifyOrder(accountId, oldOrderId, newOrder) {
        const [, taskJob] = await this._modifyOrderTaskJob(accountId, oldOrderId, newOrder);
        return await taskJob;
    }
    async _modifyOrderTaskJob(accountId, oldOrderId, newOrder) {
        const account = this._lookupAccount(accountId);
        const taskId = await account.modifyOrder(oldOrderId, newOrder);
        return [taskId, this.awaitTaskCompletion(taskId)];
    }
    async cancelOrder(accountId, orderId) {
        const [, taskJob] = await this._cancelOrderTaskJob(accountId, orderId);
        return await taskJob;
    }
    async _cancelOrderTaskJob(accountId, orderId) {
        const account = this._lookupAccount(accountId);
        const taskId = await account.cancelOrder(orderId);
        return [taskId, this.awaitTaskCompletion(taskId)];
    }
    // --------------------------------
    // | IRenegadeFees Implementation |
    // --------------------------------
    async queryDesiredFee() {
        unimplemented();
    }
    async approveFee(accountId, fee) {
        unimplemented();
    }
    async modifyFee(accountId, oldFeeId, newFee) {
        unimplemented();
    }
    async revokeFee(accountId, feeId) {
        unimplemented();
    }
    // -------------------------------------
    // | IRenegadeStreaming Implementation |
    // -------------------------------------
    async registerAccountCallback(callback, accountId, priority) {
        // We could directly register a callback with
        // this._ws.registerAccountCallback(callback, ...), but this can lead to
        // race conditions.
        //
        // Since each individual Account streams account events to update its
        // internal balances, orders, and fees, directly registering an account
        // callback with the Renegade websocket does not guarantee ordering of these
        // messages.
        //
        // Instead, we hook directly into the Account stream.
        const account = this._lookupAccount(accountId);
        return await account.ws.registerAccountCallback(callback, accountId, account.keychain, priority);
    }
    async registerPriceReportCallback(callback, exchange, baseToken, quoteToken, priority) {
        return await this._ws.registerPriceReportCallback(callback, exchange, baseToken, quoteToken, priority);
    }
    async registerTaskCallback(callback, taskId, priority) {
        return await this._ws.registerTaskCallback(callback, taskId, priority);
    }
    async registerOrderBookCallback(callback, priority) {
        return await this._ws.registerOrderBookCallback(callback, priority);
    }
    async registerNetworkCallback(callback, priority) {
        return await this._ws.registerNetworkCallback(callback, priority);
    }
    async registerMpcCallback(callback, priority) {
        return await this._ws.registerMpcCallback(callback, priority);
    }
    async releaseCallback(callbackId) {
        await this._ws.releaseCallback(callbackId);
    }
    // ---------------------------------
    // | Task-Based API Implementation |
    // ---------------------------------
    /**
     * The `task` object contains a subset of the Renegade API that contain
     * long-running tasks to be performed by the relayer. Instead of awaiting
     * entire task completion, these alternative implementations allow the caller
     * to directly receive the TaskId, and later await the task as appropriate.
     *
     * This is useful for user-focused integrations, where we want to expose
     * taskIds directly to the frontend, and allow the frontend to stream task
     * events.
     */
    task = {
        initializeAccount: async (...args) => await this._initializeAccountTaskJob(...args),
        deposit: async (...args) => await this._depositTaskJob(...args),
        withdraw: async (...args) => await this._withdrawTaskJob(...args),
        placeOrder: async (...args) => await this._placeOrderTaskJob(...args),
        modifyOrder: async (...args) => await this._modifyOrderTaskJob(...args),
        cancelOrder: async (...args) => await this._cancelOrderTaskJob(...args),
        // approveFee: async (
        //   ...args: Parameters<typeof this._approveFeeTaskJob>
        // ) => await this._approveFeeTaskJob(...args),
        // modifyFee: async (
        //   ...args: Parameters<typeof this._modifyFeeTaskJob>
        // ) => await this._modifyFeeTaskJob(...args),
        // revokeFee: async (
        //   ...args: Parameters<typeof this._revokeFeeTaskJob>
        // ) => await this._revokeFeeTaskJob(...args),
    };
}
__decorate([
    assertNotTornDown
], Renegade.prototype, "ping", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "queryExchangeHealthStates", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "queryOrders", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getVersion", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "awaitTaskCompletion", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerAccount", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "initializeAccount", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "unregisterAccount", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "delegateAccount", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getBalances", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getOrders", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getFees", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getKeychain", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "getIsLocked", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "deposit", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "withdraw", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "placeOrder", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "modifyOrder", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "cancelOrder", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "queryDesiredFee", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "approveFee", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "modifyFee", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "revokeFee", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerAccountCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerPriceReportCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerTaskCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerOrderBookCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerNetworkCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "registerMpcCallback", null);
__decorate([
    assertNotTornDown
], Renegade.prototype, "releaseCallback", null);
