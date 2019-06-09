'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

router.get('/', (req, res) => {

  const username = req.session.user.username;

  const options = {
    method: 'GET',
    url: config.api.accounts + '/' + username + '/paymentmethods'
  }

  rp(options)
    .then(function(body) {
      const paymentMethods = JSON.parse(body).paymentMethods;
      const data = {
        username: username,
        displayUsername: username.split('@')[0],
        paymentMethods: paymentMethods
      };
      res.render('./paymentmethods.ejs', data);
    })
    .catch(function(err) {
      console.log('error occurred calling api');
      console.log(err.statusCode);
      res.status(err.statusCode);
      res.render('./paymentmethods.ejs');
    })

});

module.exports = router;
