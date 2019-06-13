'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

// Supported Media
const supported_media = [ 'email', 'slack' ];

router.get('/', (req, res) => {

  res.status(200);
  res.set('Content-Type', 'text/html');
  res.render('./register.ejs');

});

router.post('/', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // Send Request to One-Time Token API
    const options = {
      method: 'POST',
      url: config.api.signup,
      json: {email: email, password: password}
    };

    rp(options)

      // Go to Verify
      .then(function(body) {

        res.status(200);
        res.set('Content-Type', 'text/html');
        res.render('./verify.ejs', { email: email, alert: '' });

      })
      // Reload Sign Up
      .catch(function(err) {

        console.log(err.statusCode);
        res.status(200);
        res.set('Content-Type', 'text/html');
        res.render('./register.ejs');

      })

});

module.exports = router;
