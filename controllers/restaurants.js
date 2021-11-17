const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')


router.get('/results', (req, res) => {
  console.log(req.query.zipCode)
    
  let  zipCode = req.query.zipCode
  let  docuMenuTest = `https://api.documenu.com/v2//restaurants/zip_code/${zipCode}?key=${process.env.NEW_API}`

  axios.get(docuMenuTest)
  .then(apiResponse => {
  // console.log(apiResponse.data)
 const results = apiResponse.data

 res.render('restaurants/results.ejs', {results:results})
  })
  .catch(error => {
    console.log(error)
})
})

router.get('/', (req, res) => {
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





module.exports = router