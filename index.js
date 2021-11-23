require('dotenv').config()
const express = require('express')
const app = express()
const ejsLayouts = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('./config/ppConfig')
const flash = require('connect-flash')
const isLoggedIn = require('./middleware/isLoggedIn')
const axios = require('axios').default
const methodOverride = require('method-override')

// views (ejs and layouts) set up
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// body parser middelware
app.use(express.urlencoded({extended:false}))

// session middleware
app.use(session({
    secret: process.env.SUPER_SECRET_SECRET,
    resave: false,
    saveUninitialized: true
}))

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// flash middleware (must go AFTER session middleware)
app.use(flash())
app.use(express.static(__dirname +'/public'))
app.use(express.static("public"))

app.use(methodOverride('_method'))
// custom middleware
app.use((req, res, next) => {
    // before every route, attach the flash messages and current user to res.locals
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    
   
    next()
})

// controllers middleware 
app.use('/auth', require('./controllers/auth'))


// home route
app.get('/', (req, res)=> {


    // res.send(apiResponse)
    res.render('home')
})








// profile route
// app.get('/profile', isLoggedIn, (req, res)=>{
//     res.render('profile.ejs')
// })

app.use('/travelBuddy', require('./controllers/indexRoute.js'))
app.use('/profile', require('./controllers/profile.js'))
app.use('/profile/restaurants', require('./controllers/restaurantRoute.js'))
app.use('/menus', require('./controllers/menus.js'))

app.listen(process.env.PORT  || 3000, ()=>{
    console.log(`process.env.SUPER_SECRET_SECRET ${process.env.SUPER_SECRET_SECRET}`)
    console.log("auth_practice running on port 3000")
})