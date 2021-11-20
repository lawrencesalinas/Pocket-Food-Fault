const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')

//------------------Render search results------------------------------//
router.get('/', (req, res) => {

//-zipcode search api call to render results-//
  let  zipCode = req.query.zipCode
  let  docuMenuTest = `https://api.documenu.com/v2//restaurants/zip_code/${zipCode}?size=10&key=${process.env.NEW_API}`
    axios.get(docuMenuTest)
    .then(apiResponse => {
    const formData = apiResponse.data
    res.render('restaurants/results.ejs', {results:formData})

//-- data from api added to the database --//
    formData.data.forEach(data => {
      const name = data.restaurant_name
      const address = data.address.formatted
      const hours = data.hours
      const phoneNumber = data.restaurant_phone
      const restaurantId = data.restaurant_id
        db.restaurant.findOrCreate({  
          where: {name: name, address: address, hours: hours, phoneNumber: phoneNumber, restaurantId:restaurantId} 
          })
        .then(foundRestaurant => {
          foundRestaurant
        })
        .catch(error => {
          console.log(error)
        })
        })
     })
    })
//------------------------------------------------------------------------//



//----show search history ------//
router.get('/searchHistory', (req, res) => {
  db.restaurant.findAll()
  .then(foundRestaurant => {
    res.render('restaurants/searchHistory.ejs', {results: foundRestaurant})
  })
  .catch(error => {
    console.log(error);
  })
})








//----------show restaurant info -----------------//
router.get('/:id', (req, res) => {
  console.log('this is the fave id\n', req.params.id)
  const restaurantId = req.params.id
  let docuMenu = `https://api.documenu.com/v2//restaurant/${restaurantId}?key=${process.env.NEW_API}`
  
  axios.get(docuMenu)
  .then(apiResponse => {
    
  const results = apiResponse.data.result
 const name = results.restaurant_name
 const address = results.address.formatted
 const cuisines = results.cuisines
 const hours = results.hours
 const menus = results.menus
 menus.forEach(menu => {
   menu.menu_sections.forEach(section => {
     
    //  const section = section.section_name
    //  res.render('restaurants/show.ejs', {items: section})
    //  console.log(item.section_name);   
     section.menu_items.forEach(more => {
      //  console.log(more.name)   item name
     })
   })
 })
 res.render('restaurants/show.ejs', {name:name, address:address, cuisines:cuisines, menus:menus, hours:hours})
  })
  .catch(error => {
    console.log(error)
})
})











module.exports = router