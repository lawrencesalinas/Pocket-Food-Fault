const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')

rrouter.get('/', (req, res) => {
    db.restaurant.findAll()
    .then(restaurant => {
      // console.log(poke)
      res.render('faveRestaurants.ejs', {results: restaurant})
    })
    .catch(error => {
      console.log(error);
    })
  });
  
  
  
  
  // router.get('/', (req,res) => {
  //   db.restaurant
  // })
  // we need a post route that will save a fave
  // the url endpoint we'll be using for creating a fave will be this:
  // '/faves/addFave'
  router.post('/', (req, res) => {
    const data = JSON.parse(JSON.stringify(req.body))
    console.log('this is data', data)
    db.restaurant.create({
      name: data.name
    })
    // })
    .then(created => {
      console.log('this is created', created)
    })
    .catch(error => {
        console.log(error)
        // we can also use console.error
    })
  })