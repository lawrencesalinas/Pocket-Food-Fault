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
  .then(foundUser => {
   const names = foundUser.restaurants
 
   res.render('profile/index.ejs', {foundUser, results:names})
  })
  })
     




//-------user and restaurant data association---//
router.post('/',isLoggedIn,(req, res) => {
  
  const formDataId = req.body.restaurantId
  db.user.findByPk(res.locals.currentUser.id)
  .then(foundUser => {
    db.restaurant.findOne({
      where: {restaurantId:formDataId}
    })
    .then( foundRestaurant => {
      // foundUser.addRestaurant(foundRestaurant.restaurantId)
      foundUser.addRestaurant(foundRestaurant)
    })
   })
})

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





    
router.delete('/:id' ,isLoggedIn, (req, res) => {
  console.log('DELETE')
 
   db.userRestaurant.destroy({
     where: {restaurantId: req.params.id, userId:res.locals.currentUser.id }
   }) 
.then(deletedItem => {
  if(deletedItem === 1){
    console.log('Deleted successfully');
  }
  res.redirect('/profile')
})
  })



















  module.exports = router