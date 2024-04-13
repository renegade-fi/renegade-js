export declare const stylusDevnetEc2: {
    blockExplorers: {
        readonly default: {
            readonly name: "Explorer";
            readonly url: "https://explorer.renegade.fi/";
        };
    };
    contracts?: {
        [x: string]: import("viem").ChainContract | {
            [sourceId: number]: import("viem").ChainContract;
        };
        ensRegistry?: import("viem").ChainContract;
        ensUniversalResolver?: import("viem").ChainContract;
        multicall3?: import("viem").ChainContract;
    };
    id: 473474;
    name: "Renegade Testnet";
    nativeCurrency: {
        readonly decimals: 18;
        readonly name: "Ether";
        readonly symbol: "ETH";
    };
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["http://35.183.100.90:8547/"];
        };
        readonly public: {
            readonly http: readonly ["http://35.183.100.90:8547/"];
        };
    };
    sourceId?: number;
    testnet: true;
    custom?: Record<string, unknown>;
    formatters?: undefined;
    serializers?: import("viem").ChainSerializers<undefined>;
    fees?: import("viem").ChainFees<undefined>;
    readonly network: "Renegade Testnet";
};
export declare const publicClient: {
    account: undefined;
    batch?: {
        multicall?: boolean | {
            batchSize?: number;
            wait?: number;
        };
    };
    cacheTime: number;
    ccipRead?: false | {
        request?: (parameters: import("viem").CcipRequestParameters) => Promise<`0x${string}`>;
    };
    chain: {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    };
    key: string;
    name: string;
    pollingInterval: number;
    request: import("viem").EIP1193RequestFn<import("viem").PublicRpcSchema>;
    transport: import("viem").TransportConfig<"http", import("viem").EIP1193RequestFn> & {
        fetchOptions?: Omit<RequestInit, "body">;
        url?: string;
    };
    type: string;
    uid: string;
    call: (parameters: import("viem").CallParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>) => Promise<import("viem").CallReturnType>;
    createBlockFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | {
                address: `0x${string}`;
                blockHash: `0x${string}`;
                blockNumber: `0x${string}`;
                data: `0x${string}`;
                logIndex: `0x${string}`;
                transactionHash: `0x${string}`;
                transactionIndex: `0x${string}`;
                removed: boolean;
            }[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: {
                address: `0x${string}`;
                blockHash: `0x${string}`;
                blockNumber: `0x${string}`;
                data: `0x${string}`;
                logIndex: `0x${string}`;
                transactionHash: `0x${string}`;
                transactionIndex: `0x${string}`;
                removed: boolean;
            }[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "block";
    }>;
    createContractEventFilter: <const TAbi extends readonly unknown[] | import("viem").Abi, TEventName extends import("viem").ContractEventName<TAbi>, TArgs extends import("viem").MaybeExtractEventArgsFromAbi<TAbi, TEventName>, TStrict extends boolean = undefined, TFromBlock extends bigint | import("viem").BlockTag = undefined, TToBlock extends bigint | import("viem").BlockTag = undefined>(args: import("viem").CreateContractEventFilterParameters<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>) => Promise<import("viem").CreateContractEventFilterReturnType<TAbi, TEventName, TArgs, TStrict, TFromBlock, TToBlock>>;
    createEventFilter: <const TAbiEvent extends import("viem").AbiEvent = undefined, const TAbiEvents extends readonly unknown[] | readonly import("viem").AbiEvent[] = TAbiEvent extends import("viem").AbiEvent ? [TAbiEvent] : undefined, TStrict_1 extends boolean = undefined, TFromBlock_1 extends bigint | import("viem").BlockTag = undefined, TToBlock_1 extends bigint | import("viem").BlockTag = undefined, _EventName extends string = import("viem").MaybeAbiEventName<TAbiEvent>, _Args extends import("viem").MaybeExtractEventArgsFromAbi<TAbiEvents, _EventName> = undefined>(args?: import("viem").CreateEventFilterParameters<TAbiEvent, TAbiEvents, TStrict_1, TFromBlock_1, TToBlock_1, _EventName, _Args>) => Promise<import("viem").Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1> extends infer T ? { [K in keyof T]: import("viem").Filter<"event", TAbiEvents, _EventName, _Args, TStrict_1, TFromBlock_1, TToBlock_1>[K]; } : never>;
    createPendingTransactionFilter: () => Promise<{
        id: `0x${string}`;
        request: import("viem").EIP1193RequestFn<readonly [{
            Method: "eth_getFilterChanges";
            Parameters: [filterId: `0x${string}`];
            ReturnType: `0x${string}`[] | {
                address: `0x${string}`;
                blockHash: `0x${string}`;
                blockNumber: `0x${string}`;
                data: `0x${string}`;
                logIndex: `0x${string}`;
                transactionHash: `0x${string}`;
                transactionIndex: `0x${string}`;
                removed: boolean;
            }[];
        }, {
            Method: "eth_getFilterLogs";
            Parameters: [filterId: `0x${string}`];
            ReturnType: {
                address: `0x${string}`;
                blockHash: `0x${string}`;
                blockNumber: `0x${string}`;
                data: `0x${string}`;
                logIndex: `0x${string}`;
                transactionHash: `0x${string}`;
                transactionIndex: `0x${string}`;
                removed: boolean;
            }[];
        }, {
            Method: "eth_uninstallFilter";
            Parameters: [filterId: `0x${string}`];
            ReturnType: boolean;
        }]>;
        type: "transaction";
    }>;
    estimateContractGas: <TChain extends import("viem").Chain, const abi extends readonly unknown[] | import("viem").Abi, functionName extends import("viem").ContractFunctionName<abi, "nonpayable" | "payable">, args extends import("viem").ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>>(args: import("viem").EstimateContractGasParameters<abi, functionName, args, TChain>) => Promise<bigint>;
    estimateGas: (args: import("viem").EstimateGasParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>) => Promise<bigint>;
    getBalance: (args: import("viem").GetBalanceParameters) => Promise<bigint>;
    getBlobBaseFee: () => Promise<bigint>;
    getBlock: <TIncludeTransactions extends boolean = false, TBlockTag extends import("viem").BlockTag = "latest">(args?: import("viem").GetBlockParameters<TIncludeTransactions, TBlockTag>) => Promise<{
        number: TBlockTag extends "pending" ? null : bigint;
        nonce: TBlockTag extends "pending" ? null : `0x${string}`;
        hash: TBlockTag extends "pending" ? null : `0x${string}`;
        logsBloom: TBlockTag extends "pending" ? null : `0x${string}`;
        baseFeePerGas: bigint;
        blobGasUsed: bigint;
        difficulty: bigint;
        excessBlobGas: bigint;
        extraData: `0x${string}`;
        gasLimit: bigint;
        gasUsed: bigint;
        miner: `0x${string}`;
        mixHash: `0x${string}`;
        parentHash: `0x${string}`;
        receiptsRoot: `0x${string}`;
        sealFields: `0x${string}`[];
        sha3Uncles: `0x${string}`;
        size: bigint;
        stateRoot: `0x${string}`;
        timestamp: bigint;
        totalDifficulty: bigint;
        transactionsRoot: `0x${string}`;
        uncles: `0x${string}`[];
        withdrawals?: import("viem").Withdrawal[];
        withdrawalsRoot?: `0x${string}`;
        transactions: TIncludeTransactions extends true ? ({
            type: "legacy";
            value: bigint;
            from: `0x${string}`;
            gas: bigint;
            nonce: number;
            to: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            v: bigint;
            yParity?: undefined;
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            blobVersionedHashes?: undefined;
            accessList?: undefined;
            chainId?: number;
            hash: `0x${string}`;
            input: `0x${string}`;
            typeHex: `0x${string}`;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_1 ? T_1 extends (TBlockTag extends "pending" ? true : false) ? T_1 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_2 ? T_2 extends (TBlockTag extends "pending" ? true : false) ? T_2 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_3 ? T_3 extends (TBlockTag extends "pending" ? true : false) ? T_3 extends true ? null : number : never : never;
        } | {
            type: "eip2930";
            value: bigint;
            from: `0x${string}`;
            gas: bigint;
            nonce: number;
            to: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            v: bigint;
            yParity: number;
            gasPrice: bigint;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas?: undefined;
            maxPriorityFeePerGas?: undefined;
            blobVersionedHashes?: undefined;
            accessList: import("viem").AccessList;
            chainId: number;
            hash: `0x${string}`;
            input: `0x${string}`;
            typeHex: `0x${string}`;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_4 ? T_4 extends (TBlockTag extends "pending" ? true : false) ? T_4 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_5 ? T_5 extends (TBlockTag extends "pending" ? true : false) ? T_5 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_6 ? T_6 extends (TBlockTag extends "pending" ? true : false) ? T_6 extends true ? null : number : never : never;
        } | {
            type: "eip1559";
            value: bigint;
            from: `0x${string}`;
            gas: bigint;
            nonce: number;
            to: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            v: bigint;
            yParity: number;
            gasPrice?: undefined;
            maxFeePerBlobGas?: undefined;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blobVersionedHashes?: undefined;
            accessList: import("viem").AccessList;
            chainId: number;
            hash: `0x${string}`;
            input: `0x${string}`;
            typeHex: `0x${string}`;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_7 ? T_7 extends (TBlockTag extends "pending" ? true : false) ? T_7 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_8 ? T_8 extends (TBlockTag extends "pending" ? true : false) ? T_8 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_9 ? T_9 extends (TBlockTag extends "pending" ? true : false) ? T_9 extends true ? null : number : never : never;
        } | {
            type: "eip4844";
            value: bigint;
            from: `0x${string}`;
            gas: bigint;
            nonce: number;
            to: `0x${string}`;
            r: `0x${string}`;
            s: `0x${string}`;
            v: bigint;
            yParity: number;
            gasPrice?: undefined;
            maxFeePerBlobGas: bigint;
            maxFeePerGas: bigint;
            maxPriorityFeePerGas: bigint;
            blobVersionedHashes: `0x${string}`[];
            accessList: import("viem").AccessList;
            chainId: number;
            hash: `0x${string}`;
            input: `0x${string}`;
            typeHex: `0x${string}`;
            blockHash: (TBlockTag extends "pending" ? true : false) extends infer T_10 ? T_10 extends (TBlockTag extends "pending" ? true : false) ? T_10 extends true ? null : `0x${string}` : never : never;
            blockNumber: (TBlockTag extends "pending" ? true : false) extends infer T_11 ? T_11 extends (TBlockTag extends "pending" ? true : false) ? T_11 extends true ? null : bigint : never : never;
            transactionIndex: (TBlockTag extends "pending" ? true : false) extends infer T_12 ? T_12 extends (TBlockTag extends "pending" ? true : false) ? T_12 extends true ? null : number : never : never;
        })[] : `0x${string}`[];
    }>;
    getBlockNumber: (args?: import("viem").GetBlockNumberParameters) => Promise<bigint>;
    getBlockTransactionCount: (args?: import("viem").GetBlockTransactionCountParameters) => Promise<number>;
    getBytecode: (args: import("viem").GetBytecodeParameters) => Promise<`0x${string}`>;
    getChainId: () => Promise<number>;
    getContractEvents: <const abi_1 extends readonly unknown[] | import("viem").Abi, eventName extends import("viem").ContractEventName<abi_1> = undefined, strict extends boolean = undefined, fromBlock extends bigint | import("viem").BlockTag = undefined, toBlock extends bigint | import("viem").BlockTag = undefined>(args: import("viem").GetContractEventsParameters<abi_1, eventName, strict, fromBlock, toBlock>) => Promise<import("viem").GetContractEventsReturnType<abi_1, eventName, strict, fromBlock, toBlock>>;
    getEnsAddress: (args: {
        blockNumber?: bigint;
        blockTag?: import("viem").BlockTag;
        coinType?: number;
        gatewayUrls?: string[];
        name: string;
        strict?: boolean;
        universalResolverAddress?: `0x${string}`;
    }) => Promise<`0x${string}`>;
    getEnsAvatar: (args: {
        name: string;
        blockNumber?: bigint;
        blockTag?: import("viem").BlockTag;
        gatewayUrls?: string[];
        strict?: boolean;
        universalResolverAddress?: `0x${string}`;
        assetGatewayUrls?: import("viem").AssetGatewayUrls;
    }) => Promise<string>;
    getEnsName: (args: {
        blockNumber?: bigint;
        blockTag?: import("viem").BlockTag;
        address: `0x${string}`;
        gatewayUrls?: string[];
        strict?: boolean;
        universalResolverAddress?: `0x${string}`;
    }) => Promise<string>;
    getEnsResolver: (args: {
        blockNumber?: bigint;
        blockTag?: import("viem").BlockTag;
        name: string;
        universalResolverAddress?: `0x${string}`;
    }) => Promise<`0x${string}`>;
    getEnsText: (args: {
        blockNumber?: bigint;
        blockTag?: import("viem").BlockTag;
        name: string;
        gatewayUrls?: string[];
        key: string;
        strict?: boolean;
        universalResolverAddress?: `0x${string}`;
    }) => Promise<string>;
    getFeeHistory: (args: import("viem").GetFeeHistoryParameters) => Promise<import("viem").GetFeeHistoryReturnType>;
    estimateFeesPerGas: <TChainOverride extends import("viem").Chain = undefined, TType extends import("viem").FeeValuesType = "eip1559">(args?: import("viem").EstimateFeesPerGasParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, TChainOverride, TType>) => Promise<import("viem").EstimateFeesPerGasReturnType>;
    getFilterChanges: <TFilterType extends import("viem").FilterType, const TAbi_1 extends readonly unknown[] | import("viem").Abi, TEventName_1 extends string, TStrict_2 extends boolean = undefined, TFromBlock_2 extends bigint | import("viem").BlockTag = undefined, TToBlock_2 extends bigint | import("viem").BlockTag = undefined>(args: import("viem").GetFilterChangesParameters<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>) => Promise<import("viem").GetFilterChangesReturnType<TFilterType, TAbi_1, TEventName_1, TStrict_2, TFromBlock_2, TToBlock_2>>;
    getFilterLogs: <const TAbi_2 extends readonly unknown[] | import("viem").Abi, TEventName_2 extends string, TStrict_3 extends boolean = undefined, TFromBlock_3 extends bigint | import("viem").BlockTag = undefined, TToBlock_3 extends bigint | import("viem").BlockTag = undefined>(args: import("viem").GetFilterLogsParameters<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>) => Promise<import("viem").GetFilterLogsReturnType<TAbi_2, TEventName_2, TStrict_3, TFromBlock_3, TToBlock_3>>;
    getGasPrice: () => Promise<bigint>;
    getLogs: <const TAbiEvent_1 extends import("viem").AbiEvent = undefined, const TAbiEvents_1 extends readonly unknown[] | readonly import("viem").AbiEvent[] = TAbiEvent_1 extends import("viem").AbiEvent ? [TAbiEvent_1] : undefined, TStrict_4 extends boolean = undefined, TFromBlock_4 extends bigint | import("viem").BlockTag = undefined, TToBlock_4 extends bigint | import("viem").BlockTag = undefined>(args?: import("viem").GetLogsParameters<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4>) => Promise<import("viem").GetLogsReturnType<TAbiEvent_1, TAbiEvents_1, TStrict_4, TFromBlock_4, TToBlock_4>>;
    getProof: (args: import("viem").GetProofParameters) => Promise<import("viem").GetProofReturnType>;
    estimateMaxPriorityFeePerGas: <TChainOverride_1 extends import("viem").Chain = undefined>(args?: {
        chain: TChainOverride_1;
    }) => Promise<bigint>;
    getStorageAt: (args: import("viem").GetStorageAtParameters) => Promise<`0x${string}`>;
    getTransaction: <TBlockTag_1 extends import("viem").BlockTag = "latest">(args: import("viem").GetTransactionParameters<TBlockTag_1>) => Promise<{
        type: "legacy";
        value: bigint;
        from: `0x${string}`;
        gas: bigint;
        nonce: number;
        to: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        v: bigint;
        yParity?: undefined;
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        blobVersionedHashes?: undefined;
        accessList?: undefined;
        chainId?: number;
        hash: `0x${string}`;
        input: `0x${string}`;
        typeHex: `0x${string}`;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_13 ? T_13 extends (TBlockTag_1 extends "pending" ? true : false) ? T_13 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_14 ? T_14 extends (TBlockTag_1 extends "pending" ? true : false) ? T_14 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_15 ? T_15 extends (TBlockTag_1 extends "pending" ? true : false) ? T_15 extends true ? null : number : never : never;
    } | {
        type: "eip2930";
        value: bigint;
        from: `0x${string}`;
        gas: bigint;
        nonce: number;
        to: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        v: bigint;
        yParity: number;
        gasPrice: bigint;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: undefined;
        maxPriorityFeePerGas?: undefined;
        blobVersionedHashes?: undefined;
        accessList: import("viem").AccessList;
        chainId: number;
        hash: `0x${string}`;
        input: `0x${string}`;
        typeHex: `0x${string}`;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_16 ? T_16 extends (TBlockTag_1 extends "pending" ? true : false) ? T_16 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_17 ? T_17 extends (TBlockTag_1 extends "pending" ? true : false) ? T_17 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_18 ? T_18 extends (TBlockTag_1 extends "pending" ? true : false) ? T_18 extends true ? null : number : never : never;
    } | {
        type: "eip1559";
        value: bigint;
        from: `0x${string}`;
        gas: bigint;
        nonce: number;
        to: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        v: bigint;
        yParity: number;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blobVersionedHashes?: undefined;
        accessList: import("viem").AccessList;
        chainId: number;
        hash: `0x${string}`;
        input: `0x${string}`;
        typeHex: `0x${string}`;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_19 ? T_19 extends (TBlockTag_1 extends "pending" ? true : false) ? T_19 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_20 ? T_20 extends (TBlockTag_1 extends "pending" ? true : false) ? T_20 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_21 ? T_21 extends (TBlockTag_1 extends "pending" ? true : false) ? T_21 extends true ? null : number : never : never;
    } | {
        type: "eip4844";
        value: bigint;
        from: `0x${string}`;
        gas: bigint;
        nonce: number;
        to: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
        v: bigint;
        yParity: number;
        gasPrice?: undefined;
        maxFeePerBlobGas: bigint;
        maxFeePerGas: bigint;
        maxPriorityFeePerGas: bigint;
        blobVersionedHashes: `0x${string}`[];
        accessList: import("viem").AccessList;
        chainId: number;
        hash: `0x${string}`;
        input: `0x${string}`;
        typeHex: `0x${string}`;
        blockHash: (TBlockTag_1 extends "pending" ? true : false) extends infer T_22 ? T_22 extends (TBlockTag_1 extends "pending" ? true : false) ? T_22 extends true ? null : `0x${string}` : never : never;
        blockNumber: (TBlockTag_1 extends "pending" ? true : false) extends infer T_23 ? T_23 extends (TBlockTag_1 extends "pending" ? true : false) ? T_23 extends true ? null : bigint : never : never;
        transactionIndex: (TBlockTag_1 extends "pending" ? true : false) extends infer T_24 ? T_24 extends (TBlockTag_1 extends "pending" ? true : false) ? T_24 extends true ? null : number : never : never;
    }>;
    getTransactionConfirmations: (args: import("viem").GetTransactionConfirmationsParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>) => Promise<bigint>;
    getTransactionCount: (args: import("viem").GetTransactionCountParameters) => Promise<number>;
    getTransactionReceipt: (args: import("viem").GetTransactionReceiptParameters) => Promise<import("viem").TransactionReceipt>;
    multicall: <const contracts extends readonly unknown[], allowFailure extends boolean = true>(args: import("viem").MulticallParameters<contracts, allowFailure>) => Promise<import("viem").MulticallReturnType<contracts, allowFailure>>;
    prepareTransactionRequest: <const TRequest extends import("viem").PrepareTransactionRequestRequest<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, TChainOverride_2>, TChainOverride_2 extends import("viem").Chain = undefined, TAccountOverride extends `0x${string}` | import("viem").Account = undefined>(args: import("viem").PrepareTransactionRequestParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, import("viem").Account, TChainOverride_2, TAccountOverride, TRequest>) => Promise<import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<import("viem").Chain, TChainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> extends infer T_37 ? T_37 extends import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> ? T_37 extends import("viem").Chain ? {
        chain: T_37;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account, TAccountOverride> extends infer T_38 ? T_38 extends import("viem").DeriveAccount<import("viem").Account, TAccountOverride> ? T_38 extends import("viem").Account ? {
        account: T_38;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_39 ? T_39 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_39 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_40 ? T_40 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_40 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_41 ? T_41 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_41 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_42 ? T_42 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_42 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_43 ? T_43 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_43 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_44 ? T_44 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_44 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_45 ? T_45 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_45 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_46 ? T_46 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_46 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number;
    }, (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "type" | "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId") extends infer T_47 ? T_47 extends (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "type" | "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId") ? T_47 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_47 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">) extends infer T_25 ? { [K_1 in keyof T_25]: (import("viem").UnionRequiredBy<Extract<import("viem").UnionOmit<import("viem").ExtractChainFormatterParameters<import("viem").DeriveChain<import("viem").Chain, TChainOverride_2>, "transactionRequest", import("viem").TransactionRequest>, "from"> & (import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> extends infer T_26 ? T_26 extends import("viem").DeriveChain<import("viem").Chain, TChainOverride_2> ? T_26 extends import("viem").Chain ? {
        chain: T_26;
    } : {
        chain?: undefined;
    } : never : never) & (import("viem").DeriveAccount<import("viem").Account, TAccountOverride> extends infer T_27 ? T_27 extends import("viem").DeriveAccount<import("viem").Account, TAccountOverride> ? T_27 extends import("viem").Account ? {
        account: T_27;
        from: `0x${string}`;
    } : {
        account?: undefined;
        from?: undefined;
    } : never : never), import("viem").IsNever<((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_28 ? T_28 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_28 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_29 ? T_29 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_29 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_30 ? T_30 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_30 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_31 ? T_31 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_31 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)> extends true ? unknown : import("viem").ExactPartial<((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_32 ? T_32 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_32 extends "legacy" ? import("viem").TransactionRequestLegacy : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_33 ? T_33 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_33 extends "eip1559" ? import("viem").TransactionRequestEIP1559 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_34 ? T_34 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_34 extends "eip2930" ? import("viem").TransactionRequestEIP2930 : never : never : never) | ((TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) extends infer T_35 ? T_35 extends (TRequest["type"] extends string ? TRequest["type"] : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)> extends "legacy" ? unknown : import("viem").GetTransactionType<TRequest, (TRequest extends ({
        accessList?: undefined;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").FeeValuesLegacy) | import("viem").Opaque<import("viem").TransactionSerializableLegacy, TRequest> | import("viem").Opaque<import("viem").TransactionRequestLegacy, TRequest> ? "legacy" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: undefined;
        maxFeePerBlobGas?: undefined;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: undefined;
    } & (import("viem").OneOf<{
        maxFeePerGas: bigint;
    } | {
        maxPriorityFeePerGas: bigint;
    }, import("viem").FeeValuesEIP1559> & {
        accessList?: import("viem").AccessList;
    })) | import("viem").Opaque<import("viem").TransactionSerializableEIP1559, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP1559, TRequest> ? "eip1559" : never) | (TRequest extends ({
        accessList?: import("viem").AccessList;
        blobs?: undefined;
        blobVersionedHashes?: undefined;
        gasPrice?: bigint;
        sidecars?: undefined;
    } & import("viem").ExactPartial<import("viem").FeeValuesLegacy> & {
        accessList: import("viem").AccessList;
    }) | import("viem").Opaque<import("viem").TransactionSerializableEIP2930, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP2930, TRequest> ? "eip2930" : never) | (TRequest extends ({
        accessList?: undefined;
        blobs?: readonly `0x${string}`[] | readonly Uint8Array[];
        blobVersionedHashes?: readonly `0x${string}`[];
        maxFeePerBlobGas?: bigint;
        maxFeePerGas?: bigint;
        maxPriorityFeePerGas?: bigint;
        sidecars?: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    } & (import("viem").ExactPartial<import("viem").FeeValuesEIP4844> & import("viem").OneOf<{
        blobs: readonly `0x${string}`[] | readonly Uint8Array[];
    } | {
        blobVersionedHashes: readonly `0x${string}`[];
    } | {
        sidecars: false | readonly import("viem").BlobSidecar<`0x${string}`>[];
    }, import("viem").TransactionSerializableEIP4844>)) | import("viem").Opaque<import("viem").TransactionSerializableEIP4844, TRequest> | import("viem").Opaque<import("viem").TransactionRequestEIP4844, TRequest> ? "eip4844" : never) | (TRequest["type"] extends string ? TRequest["type"] : never)>) ? T_35 extends "eip4844" ? import("viem").TransactionRequestEIP4844 : never : never : never)>> & {
        chainId?: number;
    }, (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "type" | "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId") extends infer T_36 ? T_36 extends (TRequest["parameters"] extends readonly import("viem").PrepareTransactionRequestParameterType[] ? TRequest["parameters"][number] : "type" | "fees" | "gas" | "nonce" | "blobVersionedHashes" | "chainId") ? T_36 extends "fees" ? "gasPrice" | "maxFeePerGas" | "maxPriorityFeePerGas" : T_36 : never : never> & (unknown extends TRequest["kzg"] ? {} : Pick<TRequest, "kzg">))[K_1]; } : never>;
    readContract: <const abi_2 extends readonly unknown[] | import("viem").Abi, functionName_1 extends import("viem").ContractFunctionName<abi_2, "pure" | "view">, args_1 extends import("viem").ContractFunctionArgs<abi_2, "pure" | "view", functionName_1>>(args: import("viem").ReadContractParameters<abi_2, functionName_1, args>) => Promise<import("viem").ReadContractReturnType<abi_2, functionName_1, args>>;
    sendRawTransaction: (args: import("viem").SendRawTransactionParameters) => Promise<`0x${string}`>;
    simulateContract: <const abi_3 extends readonly unknown[] | import("viem").Abi, functionName_2 extends import("viem").ContractFunctionName<abi_3, "nonpayable" | "payable">, args_2 extends import("viem").ContractFunctionArgs<abi_3, "nonpayable" | "payable", functionName_2>, chainOverride extends import("viem").Chain, accountOverride extends `0x${string}` | import("viem").Account = undefined>(args: import("viem").SimulateContractParameters<abi_3, functionName_2, args_2, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, chainOverride, accountOverride>) => Promise<import("viem").SimulateContractReturnType<abi_3, functionName_2, args_2, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, import("viem").Account, chainOverride, accountOverride>>;
    verifyMessage: (args: import("viem").VerifyMessageActionParameters) => Promise<boolean>;
    verifyTypedData: (args: import("viem").VerifyTypedDataActionParameters) => Promise<boolean>;
    uninstallFilter: (args: import("viem").UninstallFilterParameters) => Promise<boolean>;
    waitForTransactionReceipt: (args: import("viem").WaitForTransactionReceiptParameters<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>) => Promise<import("viem").TransactionReceipt>;
    watchBlockNumber: (args: import("viem").WatchBlockNumberParameters) => import("viem").WatchBlockNumberReturnType;
    watchBlocks: <TIncludeTransactions_1 extends boolean = false, TBlockTag_2 extends import("viem").BlockTag = "latest">(args: import("viem").WatchBlocksParameters<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, TIncludeTransactions_1, TBlockTag_2>) => import("viem").WatchBlocksReturnType;
    watchContractEvent: <const TAbi_3 extends readonly unknown[] | import("viem").Abi, TEventName_3 extends import("viem").ContractEventName<TAbi_3>, TStrict_5 extends boolean = undefined>(args: import("viem").WatchContractEventParameters<TAbi_3, TEventName_3, TStrict_5, import("viem").HttpTransport>) => import("viem").WatchContractEventReturnType;
    watchEvent: <const TAbiEvent_2 extends import("viem").AbiEvent = undefined, const TAbiEvents_2 extends readonly unknown[] | readonly import("viem").AbiEvent[] = TAbiEvent_2 extends import("viem").AbiEvent ? [TAbiEvent_2] : undefined, TStrict_6 extends boolean = undefined>(args: import("viem").WatchEventParameters<TAbiEvent_2, TAbiEvents_2, TStrict_6, import("viem").HttpTransport>) => import("viem").WatchEventReturnType;
    watchPendingTransactions: (args: import("viem").WatchPendingTransactionsParameters<import("viem").HttpTransport>) => import("viem").WatchPendingTransactionsReturnType;
    extend: <const client extends {
        [x: string]: unknown;
        account?: undefined;
        batch?: undefined;
        cacheTime?: undefined;
        ccipRead?: undefined;
        chain?: undefined;
        key?: undefined;
        name?: undefined;
        pollingInterval?: undefined;
        request?: undefined;
        transport?: undefined;
        type?: undefined;
        uid?: undefined;
    } & import("viem").ExactPartial<Pick<import("viem").PublicActions<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, undefined>, "call" | "createContractEventFilter" | "createEventFilter" | "estimateContractGas" | "estimateGas" | "getBlock" | "getBlockNumber" | "getChainId" | "getContractEvents" | "getEnsText" | "getFilterChanges" | "getGasPrice" | "getLogs" | "getTransaction" | "getTransactionCount" | "getTransactionReceipt" | "prepareTransactionRequest" | "readContract" | "sendRawTransaction" | "simulateContract" | "uninstallFilter" | "watchBlockNumber" | "watchContractEvent"> & Pick<import("viem").WalletActions<{
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, undefined>, "sendTransaction" | "writeContract">>>(fn: (client: import("viem").Client<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, undefined, import("viem").PublicRpcSchema, import("viem").PublicActions<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>>) => client) => import("viem").Client<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }, undefined, import("viem").PublicRpcSchema, { [K_2 in keyof client]: client[K_2]; } & import("viem").PublicActions<import("viem").HttpTransport, {
        blockExplorers: {
            readonly default: {
                readonly name: "Explorer";
                readonly url: "https://explorer.renegade.fi/";
            };
        };
        contracts?: {
            [x: string]: import("viem").ChainContract | {
                [sourceId: number]: import("viem").ChainContract;
            };
            ensRegistry?: import("viem").ChainContract;
            ensUniversalResolver?: import("viem").ChainContract;
            multicall3?: import("viem").ChainContract;
        };
        id: 473474;
        name: "Renegade Testnet";
        nativeCurrency: {
            readonly decimals: 18;
            readonly name: "Ether";
            readonly symbol: "ETH";
        };
        rpcUrls: {
            readonly default: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
            readonly public: {
                readonly http: readonly ["http://35.183.100.90:8547/"];
            };
        };
        sourceId?: number;
        testnet: true;
        custom?: Record<string, unknown>;
        formatters?: undefined;
        serializers?: import("viem").ChainSerializers<undefined>;
        fees?: import("viem").ChainFees<undefined>;
        readonly network: "Renegade Testnet";
    }>>;
};
