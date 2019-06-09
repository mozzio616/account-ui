'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

router.get('/', (req, res) => {

  res.status(200);
  res.set('Content-Type', 'text/html');
  res.render('./login.ejs');

});

router.post('/', (req, res, next) => {

  // Request Parameter
  const username = req.body.username;
  const password = req.body.password;

  if (req.body.rememberme === 'on') {
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
  } else {
    req.session.cookie.maxAge = null;
  }

  // Call Sign In API
  const options = {
    method: 'POST',
    url: config.api.signin,
    json: { username: username, password: password }
  };
  rp(options)
    .then(function(body) {
      console.log(body.username + ' signed in');
      req.session.user = body;
      req.session.save(function(err) {
        if (err) console.log(err);
        res.redirect('/');
      });
    })
    .catch(function(err) {
      console.log('error occurred on sign in');
      console.log(err.statusCode);
      res.render('./login.ejs', {error: err.statusCode});
    })

});

module.exports = router;
