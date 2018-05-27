var express = require('express');
var router = express.Router();
var Bittrex = require('../exchange/Bittrex');

let bittrex = new Bittrex();

function initBittrex(key, secret) {
  bittrex.setToken({
    key: key,
    secret: secret
  });
}

router.get('/balances', function (req, res) {
  initBittrex(req.session.key, req.session.secret);
  bittrex.fetchBalance((coinBalances) => {
    // console.log("~~~~ CoinBalances ~~~~");
    res.send(JSON.stringify(coinBalances));
  });
});

router.get('/openOrder', function (req, res) {
  initBittrex(req.session.key, req.session.secret);
  bittrex.fetchOpenOrder((result) => {
    // console.log("~~~~ openOrder ~~~~");
    res.send(JSON.stringify(result));
  });
});

router.get('/orderHistory', function (req, res) {
  initBittrex(req.session.key, req.session.secret);
  bittrex.fetchOrderHistory((result) => {
    // console.log("~~~~ orderHistory ~~~~");
    res.send(JSON.stringify(result));
  });
});

module.exports = router;