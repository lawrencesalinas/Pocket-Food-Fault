const express = require('express')
const router = express.Router()
const axios = require('axios')
const { render } = require('ejs')

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


//update route
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





module.exports = router