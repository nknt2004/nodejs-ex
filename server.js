//  OpenShift sample Node application
var express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    Bittrex = require('./src/exchange/Bittrex'),
    Auth = require('./src/middleware/Auth'),
    AuthRoute = require('./src/route/AuthRoute'),
    BittrexRoute = require('./src/route/BittrexRoute')
    ;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Object.assign = require('object-assign')

app.engine('html', require('ejs').renderFile);
app.use(morgan('combined'))

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0',
    mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
    mongoURLLabel = "";

if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
    var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
        mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
        mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
        mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
        mongoPassword = process.env[mongoServiceName + '_PASSWORD']
    mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
        mongoURLLabel = mongoURL = 'mongodb://';
        if (mongoUser && mongoPassword) {
            mongoURL += mongoUser + ':' + mongoPassword + '@';
        }
        // Provide UI label that excludes user id and pw
        mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
        mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;

    }
}
var db = null,
    dbDetails = new Object();

var initDb = function (callback) {
    if (mongoURL == null) return;

    var mongodb = require('mongodb');
    if (mongodb == null) return;

    mongodb.connect(mongoURL, function (err, conn) {
        if (err) {
            callback(err);
            return;
        }

        db = conn;
        dbDetails.databaseName = db.databaseName;
        dbDetails.url = mongoURLLabel;
        dbDetails.type = 'MongoDB';

        console.log('Connected to MongoDB at: %s', mongoURL);
    });
};

app.use(session({
    secret: 'N2P!lNahHz!ywe6YdKq1',
    resave: true,
    saveUninitialized: true,
    cookie: {
        path: '/',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.get('/', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
        initDb(function (err) { });
    }
    if (db) {
        var col = db.collection('counts');
        // Create a document with request IP and current time of request
        col.insert({ ip: req.ip, date: Date.now() });
        col.count(function (err, count) {
            if (err) {
                console.log('Error running count. Message:\n' + err);
            }
            res.render('index.html', { pageCountMessage: count, dbInfo: dbDetails });
        });
    } else {
        res.render('index.html', { pageCountMessage: null });
    }
});

app.get('/pagecount', function (req, res) {
    // try to initialize the db on every request if it's not already
    // initialized.
    if (!db) {
        initDb(function (err) { });
    }
    if (db) {
        db.collection('counts').count(function (err, count) {
            res.send('{ pageCount: ' + count + '}');
        });
    } else {
        res.send('{ pageCount: -1 }');
    }
});

app.use('/auth', AuthRoute);
app.use('/bittrex', Auth);
app.use('/bittrex', BittrexRoute);

// error handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});

app.use('/static', express.static(__dirname + '/views/static'))
app.use('/service-worker.js', express.static(__dirname + '/views/service-worker.js'))
app.use('/', express.static(__dirname + '/views'))

initDb(function (err) {
    console.log('Error connecting to Mongo. Message:\n' + err);
});

app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app;
