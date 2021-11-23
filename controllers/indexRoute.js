const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')
const { render } = require('ejs')



//------------------Render search results------------------------------//
router.get('/', (req, res) => {

//-request data from the api-//
  let  zipCode = req.query.zipCode
  let  docuMenuTest = `https://api.documenu.com/v2//restaurants/zip_code/${zipCode}?size=10&fullmenu=true&key=${process.env.NEW_API}`
  axios.get(docuMenuTest)
  .then(apiResponse => {
    const formData = apiResponse.data
    formData.data.forEach(data => {
      const name = data.restaurant_name
      const address = data.address.formatted
      const city = data.address.city
      const state = data.address.state
      const hours = data.hours
      const zipcode = data.address.postal_code
      const phoneNumber = data.restaurant_phone
      const restaurantCode = data.restaurant_id
    
      const menu = data.menus
  
  // -add requested data to api restaurant database-//
      db.restaurant.findOrCreate({  
        where: {name: name, address: address, hours: hours, phoneNumber: phoneNumber, restaurantCode:restaurantCode, city:city, state:state, zipcode:zipcode}
       })
       .then(created =>{
      
       })
      
       .catch(error => {
        console.log(error )
      })
        })

     })
  // -render restaurant searches coming form restaurant database-//   
     db.restaurant.findAll({
      where: { zipcode: req.query.zipCode } 
     })
      .then(restaurant => {
        
        res.render('restaurants/results.ejs', {results:restaurant, zipcode:req.query.zipCode })
      })
      .catch(error => {
        console.log(error )
      })
    })
// //------------------------------------------------------------------------//




//----------detailed restaurant info -----------------//
router.get('/:id',(req, res) => {
  
  db.restaurant.findOne({
    where: { id: req.params.id } 
  })
  .then(foundRestaurant =>{
      res.render('restaurants/detail.ejs', 
      {name: foundRestaurant.name, address: foundRestaurant.address, 
      hours: foundRestaurant.hours, phoneNumber: foundRestaurant.phoneNumber, 
      restaurantCode: foundRestaurant.restaurantCode, restaurantId: foundRestaurant.id })
  })
  .catch(error => {
    console.log(error )
  })
})

router.put('/:idx', (req, res) => {
 db.restaurant.update({
      name: req.body.name, 
      address: req.body.address, hours:req.body.hours,
      phoneNumber:  req.body.phoneNumber
  }, {
      where: { id: req.body.restaurantId } 
  })
    .then(foundRestaurant =>{   
 res.redirect(`/travelBuddy/${req.body.restaurantId}`);
})

})





module.exports = router;