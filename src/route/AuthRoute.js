var express = require('express');
var router = express.Router();
var Bittrex = require('../exchange/Bittrex');

router.post('/bittrex/login', function (req, res) {
    if (!req.body.key || !req.body.secret) {
        res.send('login failed');
    }

    req.session.signedIn = true;
    req.session.key = req.body.key;
    req.session.secret = req.body.secret;
    res.cookie('in', 'true', {httpOnly: false}).sendStatus(200);
});

router.post('/bittrex/logout', function (req, res) {
    req.session.destroy();
    res.cookie('in', 'false').send("logout success!");
});

module.exports = router;