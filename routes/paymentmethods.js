'use strict'

const router = require('express').Router();

router.get('/', (req, res) => {

  const username = req.session.user.username;
  const data = {
    username: username,
    displayUsername: username.split('@')[0]
  };

  res.render('./paymentmethods.ejs', data);

});

module.exports = router;
