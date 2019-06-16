'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

const title = 'Organization';
const subtitle = 'Create Organization';

router.get('/', (req, res) => {

  const username = req.session.user.username;
  let orgName = req.session.user.orgName;
  let orgId = req.session.user.orgId;
  let role = req.session.user.role;
  if (!orgName || !orgId || !role) {
    orgName = 'No Organization';
    orgId = 'Create org first!';
    role = 'Unknown'
  }
  const data = {
    title: title,
    subtitle: subtitle,
    username: username,
    displayUsername: username.split('@')[0],
    orgName: orgName,
    orgId: orgId,
    role: role
  }
  res.status(200);
  res.render('./create-org.ejs', data);

});

router.post('/', (req, res) => {

  const username = req.session.user.username;
  const orgName = req.body.orgName;

  const options = {
    method: 'POST',
    url: config.api.accounts + '/' + username + '/orgs',
    json: { orgName: orgName }
  }

  const orgId = req.session.user.orgId;
  const role = req.session.user.role;

  rp(options)
    .then(function(body) {
      console.log(body);
      res.redirect('/switch-org');
    })
    .catch(function(err) {
      console.log('error occurred calling api');
      res.redirect('/login');
    })

});

module.exports = router;
