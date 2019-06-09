'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

router.get("/", (req, res) => {

    res.status(301);
    res.redirect('/');

});

router.post('/', (req, res) => {

    // Request Parameter
    const email = req.body.email;
    const token = req.body.token;

    // Call Sign Up API
    const options = {
      method: 'POST',
      url: config.api.signup,
      json: { email: email, token: token }
    };

    rp(options)
      .then(function(body) {
        res.session.user = body;
        res.status(301);
        res.redirect('/');
      })
      .catch(function(err) {
        console.log('error occurred on sing up');
        console.log(err.statusCode);
        if (err.statusCode == 401) {
          res.status(401);
          res.set('Content-Type', 'text/html');
          res.render('./verify.ejs', { email: email, error: 'Incorrect code. Please retry.' });
        } else {
          res.status(301);
          res.redirect('/');
        }
      })

});

module.exports = router;
