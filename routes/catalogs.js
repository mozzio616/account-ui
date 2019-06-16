'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

const title = 'Product Catalog';
const subtitle = 'Available Catalog';

router.get('/', (req, res) => {

  const username = req.session.user.username;
  const orgName = req.session.user.orgName;
  const orgId = req.session.user.orgId;
  const orgCh = req.session.user.orgCh;
  const role = req.session.user.role;
  const colors = ['bg-aqua', 'bg-green', 'bg-yellow', 'bg-maroon'];

  const options = {
    method: 'GET',
    url: config.api.catalogs + '/' + orgCh + '/' + orgId
  }

  rp(options)
    .then(function(body) {
      const catalogs = JSON.parse(body);
console.log(catalogs);
      const data = {
        title: title,
        subtitle: subtitle,
        username: username,
        displayUsername: username.split('@')[0],
        catalogs: catalogs,
        orgName: orgName,
        orgId: orgId,
        orgCh: orgCh,
        role: role,
        colors: colors
      };
      res.render('./catalogs.ejs', data);
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
  const catalogId = req.body.catalogId;

  res.redirect('/catalogs/' + catalogId);

});


router.get('/:catalogId', (req, res) => {

  const catalogId = req.params.catalogId;
  const username = req.session.user.username;
  const orgName = req.session.user.orgName;
  const orgId = req.session.user.orgId;
  const orgCh = req.session.user.orgCh;
  const role = req.session.user.role;

  const options = {
    method: 'GET',
    url: config.api.catalogs + '/' + orgCh + '/' + orgId + '/' + catalogId
  }

  rp(options)
    .then(function(body) {
      const items = JSON.parse(body);
console.log(items);
      const data = {
        title: title,
        subtitle: subtitle,
        username: username,
        displayUsername: username.split('@')[0],
        items: items,
        orgName: orgName,
        orgId: orgId,
        orgCh: orgCh,
        role: role
      };
      res.render('./items.ejs', data);
    })
    .catch(function(err) {
      console.log('error occurred calling api');
      console.log(err.statusCode);
      res.status(err.statusCode);
      res.render('./orgs.ejs', data);
    })

});

module.exports = router;
