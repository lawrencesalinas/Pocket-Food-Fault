const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const { render } = require('ejs')
const flash = require('connect-flash')


// router.get('/', (req, res) => {
//     db.restaurant.findAll()
//     .then(foundRestaurant => {
//       res.render('faves/faveRestaurants.ejs', {results: foundRestaurant})
//     })
//     .catch(error => {
//       console.log(error);
//     })
//   })

  //  console.log(req.user)
  // router.post('/',(req, res) => {
  //   const formData = req.body.restaurantId 
    
  // console.log(formData);
//     db.userRestaurant.create({
//         // restaurantId : req.body.restaurantId,
//         // name: req.body.name
//         // userId: res.locals.currentUser.id,
       
//         // console.log(req.body.recipeLabel)
//         // console.log(req.body.recipeUrl)
//     })
//     .then(created =>{
//         console.log(created)
//         res.redirect('/profile')
//     })
//     .catch(err =>{
//         console.log(err)
//     })
// })











router.post('/',(req, res) => {
  const formData = req.body.restaurantId 
  // console.log(res.locals.currentUser.id);
console.log(formData);
  db.user.create({
        restaurantId : req.body.restaurantId,
        // UserId: res.locals.currentUser.id

    })


  .then(foundUser => {
    db.restaurant.findbyPk(req.body.restaurantId)
    .then( foundRestaurant => {
      foundUser.addRestaurant(foundRestaurant)
      
    })
  })
})

// router.post('/addFave', (req, res) => {
//   const data = JSON.parse(JSON.stringify(req.body))
//   console.log('this is data', data)
//   db.favorite.create({
//       title: data.title,
//       imdbId: data.imdbId
//   })
//   .then(createdFave => {
//       console.log('db instance created: \n', createdFave)
//       res.redirect(`/faves/${createdFave.id}`)
//   })
//   .catch(error => {
//       console.log(error)
//           // we can also use console.error
//   })
// })
    
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