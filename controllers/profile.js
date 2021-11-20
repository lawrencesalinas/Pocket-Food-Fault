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
  
  db.user.findByPk(res.locals.currentUser.id, {include: [db.restaurant] })
  .then(found => {
    // console.log(found.dataValues.restaurants)
   const names = found.dataValues.restaurants
   res.render('profile/index.ejs', {results:names})
  })
  })
     




//-------user and restaurant data association---//
router.post('/',isLoggedIn,(req, res) => {
  const formDataName = req.body.n
  const formDataId = req.body.restaurantId
  db.user.findByPk(res.locals.currentUser.id)
  .then(foundUser => {
    db.restaurant.findOne({
      where: {restaurantId:formDataId}
    })
    .then( foundRestaurant => {
      // foundUser.addRestaurant(foundRestaurant.)
      // foundUser.addRestaurant(foundRestaurant.name)
      foundUser.addRestaurant(foundRestaurant.restaurantId)
      foundUser.addRestaurant(foundRestaurant)
      // foundUser.addRestaurant(foundRestaurant.name)

    })
   })
})

    
router.delete('/:id', (req, res) => {
  // console.log('this is the id\n', req.params.id)
  db.restaurant.destroy({
      where: { id: req.params.id }
  })
  .then(deletedItem => {
      // destroy returns '1' if something was deleted and '0' if nothing happened
      console.log('you deleted: ', deletedItem)
      res.redirect('/')
  })
  .catch(error => {
      console.error
  })
})




  // router.get('/', (req,res) => {
  //   db.restaurant
  // })
  // we need a post route that will save a fave
  // the url endpoint we'll be using for creating a fave will be this:
  // '/faves/addFave'
  // router.post('/', (req, res) => {
  //   // const data = JSON.parse(JSON.stringify(req.body))
  //   // console.log('this is data', data)
  //   db.user.findAll()
  //   .then(foundUser=> {
  //       db.restaurant.findByPk()
  //       .then(foundRestaurant => {
  //           foundUser.addRestaurant(foundRestaurant)
  //       })
  //     })
  // //   })
  //       // we can also use console.error
  //   })
  











  module.exports = router