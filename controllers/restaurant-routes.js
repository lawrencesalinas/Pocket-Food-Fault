const express = require('express')
const router = express.Router()
const axios = require('axios')
const { render } = require('ejs')
const db = require('../models')
const isLoggedIn = require('../middleware/isLoggedIn')
const review = require('../models/review')


//------------------Render search results------------------------------//
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
})







//------------------REVIEW ROUTES---------------------------------------------------------//

//-----------show route for reviews of a specific restaurant--------//
router.get('/reviews/:id', (req, res) => {
  console.log(req.body);
  let restaurantId = req.params.id
  let  docuMenuApi = `https://api.documenu.com/v2//restaurant/${restaurantId}?key=${process.env.NEW_API}`
axios.get(docuMenuApi)
.then(apiResponse => {
  let resData = apiResponse.data.result

  db.review.findAll({
    where:({restaurantId:req.params.id})
  })
  .then(review => {
    console.log(review);
    res.render('restaurants/comments.ejs', {results:review, restaurant:resData} )
  })
})
}) 
   

//----adding a user review to the userReview database-----//
router.post('/reviews/:id',isLoggedIn, (req, res) => {
// console.log('req.body',req.body.comment);
// console.log('req.user.id:', req.user.id)
  db.review.findOrCreate({
    where: ({comment:req.body.comment,
             userId:req.user.id,
             restaurantId: req.params.id
            })
  })
  .then(([review, created]) => {
    // console.log('hello',review);
    // console.log('createaed',created);
    db.user.findByPk(req.user.id)
      .then(user => {
        user.addReview(review)
      })
      .then(user => {
        res.redirect(`/restaurants/reviews/${req.params.id}`)
      })
    })
  })

  router.get('/reviews/edit/:id' ,isLoggedIn, (req, res) => {
    console.log('params', req.params.id);
   db.review.findOne({ 
     where: ({id:req.params.id})
   })
   .then(review => {
      console.log('editget',review)
    res.render('restaurants/edit.ejs', {results:review})
   })
  })






  router.put('/reviews/:idx',isLoggedIn, (req, res) => {
  console.log('body', req.body);
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