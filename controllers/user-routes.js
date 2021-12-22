const express = require('express')
const router = express.Router()
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const { render } = require('ejs')
const flash = require('connect-flash')
const isLoggedIn = require('../middleware/isLoggedIn')

//-----------GET route to render a list of the users favorite restaurants--//

router.get('/',isLoggedIn, (req, res) => {
  res.render('user/userProfile.ejs')
})

router.get('/restaurants',isLoggedIn, (req, res) => {
    //find user restaurants data using user id and user restaurants
    db.user.findByPk(req.user.id, {include: [db.restaurant] })
    .then(foundUser => {
     const restaurantNames = foundUser.restaurants
      console.log(foundUser.restaurants)
     
    res.render('user/index.ejs' ,{results:restaurantNames})
    })
       .catch(error => {
        console.log(error)
    })
})



// -------------POST route to add a restaurant on users profile----//
router.post('/restaurants',isLoggedIn,(req, res) => {
    console.log(req.body.restaurantCode)
    console.log(req.body.address);
    // we create and save the restauand current user using current user id //
    db.restaurant.findOrCreate({
      where: {
        name: req.body.name,
        address: req.body.address,
        restaurantCode: req.body.restaurantCode
      }
    })
    .then(([restaurant, created]) => {
        db.user.findByPk(req.user.id)
        .then(user => {
            user.addRestaurant(restaurant)
        })
    })
})


//---------------DELETE a user favorite restaurant----//      
router.delete('restaurants/:id' ,isLoggedIn, (req, res) => {
    console.log('DELETE')
   //remove restaurants from a user by the join table id's
     db.userRestaurant.destroy({
       where: {restaurantId: req.params.id, userId:req.user.id }
     }) 
  .then(deletedItem => {
    if(deletedItem === 1){
      console.log('Deleted successfully');
    }
    res.redirect('/profile/restaurants')
  })
    })



module.exports = router