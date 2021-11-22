const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const { render } = require('ejs')
const flash = require('connect-flash')
const isLoggedIn = require('../middleware/isLoggedIn')

//------render the my profile, favorite restaurant----//
router.get('/',isLoggedIn, (req, res) => {
  res.render('profile/profileIndex.ejs')
})


  module.exports = router