const BittrexClient = require('node-bittrex-api');

module.exports = class Bittrex {
    constructor(cb) {
        this.cb = cb;
        this.summary = {};
        this.details = [];
        this.numberOfCoins = 0;
        this.processingCoin = 0;
    }

    setToken(token) {
        BittrexClient.options({
            'apikey': token.key,
            'apisecret': token.secret,
        });
    }

    fetchBalance(cb) {
        this.callback = cb;
        this.details = [];
        this.numberOfCoins = 0;
        this.processingCoin = 0;

        BittrexClient.getbalances((data, err) => {
            if (err) {
                console.error(err);
                return;
            }
            data.result.forEach((tickerData, index) => {
                if (tickerData.Balance > 0) {
                    this.numberOfCoins++;
                    this._checkRate(tickerData);
                }
            });
        });
    }

    fetchOpenOrder(cb) {
        BittrexClient.getopenorders({}, (data, err) => {
            if (err) {
                console.error(err);
                return;
            }
            cb(data.result);
        })
    }

    fetchOrderHistory(cb) {
        BittrexClient.getorderhistory({}, (data, error) => {
            let getCoinName = (name) => name.substr(4);

            let coinOrders = data.result.reduce((coinOrders = {}, order, i) => {
                let coinName = getCoinName(order.Exchange);
                coinOrders[coinName] = coinOrders[coinName] || [];
                coinOrders[coinName].push(order);
                return coinOrders;
            }, {});
            cb(coinOrders);
        })
    }

    buildCoinDetails(currency, balance, rate) {
        return {
            Currency: currency,
            Balance: balance,
            Rate: rate,
            BalanceBTC: balance * rate
        }
    }

    tickerToCoinDetails(tickerData, rate) {
        return this.buildCoinDetails(tickerData.Currency, tickerData.Balance, rate);
    }

    _checkRate(tickerData) {
        var ticker = {};
        ticker.currency = tickerData.Currency;
        ticker.balance = tickerData.Balance;

        if (tickerData.Currency === "BTC") {
            this.processingCoin++;
            //console.log("-------total in BTC: " + total + " -------------");
            var coinDetails = this.tickerToCoinDetails(tickerData, 1);
            this.details.push(coinDetails);
        }
        else {
            BittrexClient.getticker({ market: `BTC-${ticker.currency}` }, (data, err) => {
                //console.log(`\nBTC-${ticker.currency}`);
                if (err != null) {
                    console.log(`ERROR: ${ticker.currency} - ${err}`);
                    // return false;
                    this.details.push(this.buildCoinDetails(`!!! ${ticker.currency}`, ticker.balance, 0))
                }

                if (data && !data.result) {
                    console.log(`Can't fetch ${ticker.currency}`);
                    // return false;
                }

                if (data) {
                    var rate = data.result.Last;
                    var coinDetails = this.tickerToCoinDetails(tickerData, rate);
                    this.details.push(coinDetails);
                }

                this.processingCoin++;
                if (this.processingCoin === this.numberOfCoins) {
                    this.callback(this.details);
                }
            });
        }
    }
}