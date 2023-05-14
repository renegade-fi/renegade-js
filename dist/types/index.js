export var Exchange;
(function (Exchange) {
    Exchange[Exchange["Median"] = 0] = "Median";
    Exchange[Exchange["Binance"] = 1] = "Binance";
    Exchange[Exchange["Coinbase"] = 2] = "Coinbase";
    Exchange[Exchange["Kraken"] = 3] = "Kraken";
    Exchange[Exchange["Okx"] = 4] = "Okx";
    Exchange[Exchange["Uniswapv3"] = 5] = "Uniswapv3";
})(Exchange || (Exchange = {}));
