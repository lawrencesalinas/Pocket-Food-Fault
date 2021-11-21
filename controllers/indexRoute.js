const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')



//------------------Render search results------------------------------//
router.get('/', (req, res) => {

//-request data from the api-//
  let  zipCode = req.query.zipCode
  let  docuMenuTest = `https://api.documenu.com/v2//restaurants/zip_code/${zipCode}?size=10&key=${process.env.NEW_API}`
  axios.get(docuMenuTest)
  .then(apiResponse => {
    const formData = apiResponse.data
    formData.data.forEach(data => {
      const name = data.restaurant_name
      const address = data.address.formatted
      const hours = data.hours
      const phoneNumber = data.restaurant_phone
      const restaurantCode = data.restaurant_id
  //-add requested data to api restaurant database-//
      db.restaurant.findOrCreate({  
        where: {name: name, address: address, hours: hours, phoneNumber: phoneNumber, restaurantCode:restaurantCode} 
       })
       .then(created =>{
        //  console.log(created);
       })
       .catch(error => {
        console.log(error )
      })
        })

     })
  //-render restaurant searches coming form restaurant database-//   
     db.restaurant.findAll()
      .then(restaurant => {
        
        res.render('restaurants/results.ejs', {results:restaurant})
      })
      .catch(error => {
        console.log(error )
      })
    })
// //------------------------------------------------------------------------//



// //----show search history ------//
// router.get('/searchHistory', (req, res) => {
//   db.restaurant.findAll()
//   .then(foundRestaurant => {
//     res.render('restaurants/searchHistory.ejs', {results: foundRestaurant})
//   })
//   .catch(error => {
//     console.log(error);
//   })
// })




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








module.exports = router;