'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

const title = 'Organization';
const subtitle = 'Switch Organization';

router.get('/', (req, res) => {

  const username = req.session.user.username;
  const orgName = req.session.user.orgName;
  const orgId = req.session.user.orgId;
  const role = req.session.user.role;

  const options = {
    method: 'GET',
    url: config.api.accounts + '/' + username + '/orgs'
  }

console.log(options);
  rp(options)
    .then(function(body) {
      const orgs = JSON.parse(body);
      const data = {
        title: title,
        subtitle: subtitle,
        username: username,
        displayUsername: username.split('@')[0],
        orgs: orgs,
        orgName: orgName,
        orgId: orgId,
        role: role
      };
      res.render('./switch-org.ejs', data);
    })
    .catch(function(err) {
      console.log('error occurred calling api');
      console.log(err.statusCode);
      res.status(err.statusCode);
      res.render('./orgs.ejs', data);
    })

});

router.post('/', (req, res) => {

  const username = req.session.user.username;
  const orgId = req.body.orgId;

  const options = {
    method: 'GET',
    url: config.api.accounts + '/' + username + '/orgs/' + orgId
  }

  rp(options)
    .then(function(body) {
      const org = JSON.parse(body);
      req.session.user.orgName = org.orgName;
      req.session.user.orgId = org.orgId;
      req.session.user.orgCh = org.channel;
      req.session.user.role = org.orgUsers.role;
      const data = {
        title: title,
        subtitle: subtitle,
        username: username,
        displayUsername: username.split('@')[0],
        orgName: req.session.user.orgName,
        orgId: req.session.user.orgId,
        orgCh: req.session.user.orgCh,
        role: req.session.user.role
      };
      res.redirect('/orgs');
    })
    .catch(function(err) {
      console.log('error occurred calling api');
      console.log(err.statusCode);
      res.redirect('/login');
    })

});

module.exports = router;
