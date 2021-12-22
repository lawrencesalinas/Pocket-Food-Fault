const express = require('express')
const router = express.Router()
const axios = require('axios')
const { render } = require('ejs')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const review = require('../models/review')


//------------------Restaurant Routes------------------------------//
router.get('/', (req, res) => {
//-request data from the api-//
  let  zipCode = req.query.zipCode
  let  docuMenuTest = `https://api.documenu.com/v2//restaurants/zip_code/${zipCode}?size=10&fullmenu=true&key=${process.env.NEW_API}`
  axios.get(docuMenuTest)
  .then(apiResponse => {
    let formData = apiResponse.data.data
    // console.log(formData)
    res.render('restaurants/results.ejs', {results: formData, zipcode: zipCode})
   })
  .catch(error => {
    console.log(error)
  })
})
    

// -------------POST route to add a restaurant on users profile----//
router.post('/',isLoggedIn,(req, res) => {
  // console.log(req.body.restaurantCode)
  db.restaurant.findOrCreate({
    where: {
      name: req.body.name,
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

//------------------------------------------------------------------------//


  
//----------detailed restaurant info -----------------//
router.get('/:id', (req, res) => {
  let restaurantId = req.params.id
  let  docuMenuApi = `https://api.documenu.com/v2//restaurant/${restaurantId}?key=${process.env.NEW_API}`
  axios.get(docuMenuApi)
  .then(apiResponse => {
      let resData = apiResponse.data.result
      let menuItems = []
      //data for the menus
      resData.menus.forEach(menu =>{
        menu.menu_sections.forEach(items => {
            // console.log(items)
          items.menu_items.forEach(items =>{
            menuItems.push(items);
          })
        })
      })
  res.render('restaurants/detail.ejs', {results:resData, menus: menuItems})
  })
  .catch(error => {
    console.log(error)
  })
})


//------------------REVIEW ROUTES---------------------------------------------------------//

//-----------show route for reviews of a specific restaurant--------//
router.get('/reviews/:id',isLoggedIn, (req, res) => {
  console.log(req.body);
  let restaurantId = req.params.id
  let  docuMenuApi = `https://api.documenu.com/v2//restaurant/${restaurantId}?key=${process.env.NEW_API}`
  axios.get(docuMenuApi)
  .then(apiResponse => {
    let resData = apiResponse.data.result
    // query reviews where the restaurantId is the same as the params 
    // to create a specific review page for every restaurant
    db.review.findAll({
      where: {restaurantId:req.params.id}
    })
    .then(reviews =>{
      res.render('restaurants/comments.ejs', {reviews:reviews,restaurant:resData} )
    })
    .catch(error => {
      console.log(error)
    })
  })
})
   
//----adding a user review to the userReview database-----//
router.post('/reviews/:id',isLoggedIn, (req, res) => {
  // console.log('req.body',req.body.comment);
  // console.log('req.user.id:', req.user.id)
  console.log(req.body);
   console.log('req.user.id:', req.body.reviewOwner)
    db.user.findByPk(req.user.id)
    .then(user=> {
      console.log('adding review to this user', user.id)
      user.createReview({
        // req.body coming from comments.ejs
        comment: req.body.comment,
        // created and added  restaurantId for the review model to correlate a specific review page 
        // for a sppecific restaurant since we're not saving the restaurants to our database 
        restaurantId: req.params.id,
        reviewOwner: req.body.reviewOwner 
      }).then(review=> {
        // console.log(review);
        // instantly add review to the page
        res.redirect(`/restaurants/reviews/${req.params.id}`)
      })
      .catch(error => {
        console.log(error)
      })
    })
})

  //----------Show route to edit form for reviews------------------//
  router.get('/reviews/edit/:id' ,isLoggedIn, (req, res) => {
   // console.log('params', req.params.id);
   db.review.findOne({ 
     where: ({id:req.params.id})
   })
   .then(review => {
      // console.log('editGET',review)
      res.render('restaurants/edit.ejs', {results:review})
   })
  })

// //--------------Put route to edit reviews---------------------//
  router.put('/reviews/:id',isLoggedIn, (req, res) => {
    // console.log('body', req.body);
    db.review.update({
         comment:req.body.comment
    }, {
         where: { id: req.body.reviewId } 
    })
    .then(foundReview =>{   
      res.redirect(`/restaurants/reviews/${req.body.restaurantId}`);
    })
   
  })




module.exports = router