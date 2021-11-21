const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const restaurant = require('../models/restaurant')
const user = require('../models/user')
const { render } = require('ejs')
const flash = require('connect-flash')
const isLoggedIn = require('../middleware/isLoggedIn')

//-----------GET route to render a list of the users favorite restaurants--//
router.get('/',isLoggedIn, (req, res) => {
    //find user restaurants data using user id and user restaurants
    db.user.findByPk(res.locals.currentUser.id, {include: [db.restaurant] })
    .then(foundUser => {
     const names = foundUser.restaurants
    res.render('profile/restaurants/index.ejs' ,{results:names})
    })
       .catch(error => {
        console.log(error)
    })
})

router.get('/results', (req, res) => {

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
            
            res.render('profile/restaurants/results.ejs', {results:restaurant})
          })
          .catch(error => {
            console.log(error )
          })
        })




//-------------POST route to add a restaurant on users profile----//
router.post('/add',isLoggedIn,(req, res) => {
    // console.log(req.body);
    db.restaurant.findByPk(req.body.restaurantId)
    .then(foundRestaurant => {
      db.user.findByPk(res.locals.currentUser.id)
    .then( foundUser => {
        console.log(foundUser)
       foundRestaurant.addUser(foundUser)
    })
    .catch(error => {
        console.log(error)
    })
    })
})

router.get('/edit/:id' ,isLoggedIn, (req, res) => {
    db.restaurant.findOne({
        where: { id: req.params.id } 
      })
      .then(foundRestaurant =>{
          console.log(foundRestaurant)
          res.render('profile/restaurants/edit.ejs', 
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
        name: req.body.name
    }, {
        where: { id: req.body.restaurantId } 
    })
      .then(foundRestaurant =>{
      
    //re-assign the name and type fields of the dinosaur to be editted
 

   
    res.redirect(`/profile/restaurants/${req.body.restaurantId}`);
  })
 
})









//------------GET route for users' detailed restaurants----//
router.get('/:id',isLoggedIn,(req, res) => {
  
    db.restaurant.findOne({
      where: { id: req.params.id } 
    })
    .then(foundRestaurant =>{
        res.render('profile/restaurants/detail.ejs', 
        {name: foundRestaurant.name, address: foundRestaurant.address, 
        hours: foundRestaurant.hours, phoneNumber: foundRestaurant.phoneNumber, 
        restaurantCode: foundRestaurant.restaurantCode, restaurantId: foundRestaurant.id })
    })
    .catch(error => {
      console.log(error )
    })
})



//---------------DELETE a user favorite restaurant----//      
router.delete('/:id' ,isLoggedIn, (req, res) => {
    console.log('DELETE')
   
     db.userRestaurant.destroy({
       where: {restaurantId: req.params.id, userId:res.locals.currentUser.id }
     }) 
  .then(deletedItem => {
    if(deletedItem === 1){
      console.log('Deleted successfully');
    }
    res.redirect('/profile/restaurants')
  })
    })


module.exports = router