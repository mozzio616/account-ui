const express = require('express');
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/config/';
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();

// Static
app.use(express.static(__dirname + '/node_modules/admin-lte/bower_components'));
app.use(express.static(__dirname + '/node_modules/admin-lte/dist'));
app.use(express.static(__dirname + '/public'));

// Template Engine
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.engine('ejs', require('ejs').__express);

// Middleware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(''));

// Session Store
const dbUrl = 'mongodb+srv://' + config.db.user + ':' + config.db.pass + '@' + config.db.host + '/' + config.db.name;

const store = new MongoDBStore({
  uri: dbUrl,
  collection: 'session'
});

store.on('error', function(error) {
  console.log(error);
});

// Session
app.use(session({
  store: store,
  secret: 'mysecret',
  resave: false,
  saveUninitialized: true
}));

// Session Check
const sessionCheck = function(req, res, next) {
  console.log(req.session);
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Routing
app.use("/login", require(__dirname + '/routes/login.js'));
app.use("/register", require(__dirname + '/routes/register.js'));
app.use("/verify", require(__dirname + '/routes/verify.js'));
app.use("/", sessionCheck, require(__dirname + '/routes/index.js'));
app.use("/orgs", sessionCheck, require(__dirname + '/routes/orgs.js'));
app.use("/switch-org", sessionCheck, require(__dirname + '/routes/switch-org.js'));
app.use("/create-org", sessionCheck, require(__dirname + '/routes/create-org.js'));
app.use("/catalogs", sessionCheck, require(__dirname + '/routes/catalogs.js'));
app.use("/paymentmethods", sessionCheck, require(__dirname + '/routes/paymentmethods.js'));
app.use("/logout", require(__dirname + '/routes/logout.js'));

module.exports = app;

