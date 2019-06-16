'use strict'

const router = require('express').Router();
const config = require('config');
process.env["NODE_CONFIG_DIR"] = __dirname + '/../config/';
const rp = require('request-promise');

const title = 'Dashboard';
const subtitle = '';

router.get('/', (req, res) => {

  const username = req.session.user.username;
  let orgName = req.session.user.orgName;
  let orgId = req.session.user.orgId;
  let orgCh = req.session.user.orgCh;
  let role = req.session.user.role;

  //
  // Get org info via API if not exist in session
  //
  if (!orgName || !orgId || !orgCh || !role) {

    const options = {
      method: 'GET',
      url: config.api.accounts + '/' + username + '/orgs'
    }

    rp(options)
      .then(function(body) {
        const orgs = JSON.parse(body);

        //
        // Redirect to create org page if no org created yet.
        //
        if (orgs.length < 1) {

          res.redirect('/create-org');

        //
        // Set 1st org in array into session
        //
        } else {
 
          req.session.user.orgName = orgs[0].orgName;
          req.session.user.orgId = orgs[0].orgId;
          req.session.user.orgCh = orgs[0].channel;
          req.session.user.role = orgs[0].orgUsers.role;

          const data = {
            title: title,
            subtitle: subtitle,
            username: username,
            displayUsername: username.split('@')[0],
            orgName: orgs[0].orgName,
            orgId: orgs[0].orgId,
            orgCh: orgs[0].channel,
            role: orgs[0].orgUsers.role
          };

          res.render('./index.ejs', data);

        }

      })

      //
      // Redirect to login page if API fails
      //
      .catch(function(err) {
        console.log('error occurred calling api');
        console.log(err.statusCode);
        res.redirect('/login');
      })

  //
  // Got org info from session
  //
  } else {

    const data = {
      title: title,
      subtitle: subtitle,
      username: username,
      displayUsername: username.split('@')[0],
      orgName: orgName,
      orgId: orgId,
      orgCh: orgCh,
      role: role
    };

    res.status(200);
    res.render('./index.ejs', data);

  }

});

module.exports = router;
