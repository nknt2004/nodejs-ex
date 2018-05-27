const auth = function (req, res, next) {
    if (req.session && req.session.signedIn) {
        return next();
    }
    else {
        return res.sendStatus(401);
    }

    if (req.session.cookie.expires < new Date()) {
        req.session.destroy();
        return res.cookie('in', 'false').sendStatus(410);
    }
};

module.exports = auth;