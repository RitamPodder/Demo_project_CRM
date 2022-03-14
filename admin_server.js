require('dotenv').config()

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const flash = require('connect-flash')
const bodyParser = require('body-parser')

const pool = require('./config/database.js')

const app = express()

var url = require('url');
var cors = require('cors');
const { Console } = require("console");
const { SSL_OP_TLS_D5_BUG } = require("constants");

//-----------for file upload---------------

var formidable = require("formidable");
var fs = require("fs");



app.use(express.static(__dirname + '/uploads'));

//--------------------------

const PORT = process.env.PORT || 3000

//const routes = require('./routes/index')

app.use(express.static(__dirname + '/views'));


app.use(cors());

app.set('view engine', 'ejs')
app.use(session({
    secret: 'thatsecretthinggoeshere',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use(function(req, res, next){
    res.locals.message = req.flash('message');
    next();
});

//app.use('/', routes)
require('./config/passport')(passport)

app.listen(PORT, () => {
    console.log(`Application server started on port: ${PORT}`)
})


  
//------------------------ROUTINGS---------------------------//

app.get("/404-not-found", (req, res) =>  {
  res.render("404-page-not-found.ejs");
});

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
      res.render('admin_panel_index', {
          title: 'admin_panel_index',
          user: req.user,
          message: res.locals.message
      })
  } else {
      res.render('admin_panel_login', {
          title: 'Log In',
          user: req.user,
          message: res.locals.message
      })
  }
})

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
      req.flash('message', 'Your are already logged in.')
      res.redirect('/home')
  } else {
      res.render('admin_panel_login', {
          title: 'Login',
          user: req.user,
          message: res.locals.message
      })
  }
})

app.post('/login', (req, res, next) => {
  if (req.isAuthenticated()) {
      req.flash('message', 'You are already logged in.')
      res.redirect('/main_admin_panel')
  } else {
      let user = (req.body.username).toLowerCase()
      let pass = req.body.password
      if (user.length === 0 || pass.length === 0) {
          req.flash('message', 'You must provide a username and password.')
          res.redirect('/login')
      } else {
          next()
      }
  }
}, passport.authenticate('login', {
  successRedirect : '/main_admin_panel',
  failureRedirect : '/login',
  failureFlash : true
}))


//-----------------disable it for registering admin------------------//
//app.post('/register', (req, res, next) => {
//  if (req.isAuthenticated()) {
//      //req.flash('message', 'You are already logged in.')
//      //res.redirect('/profile')
//      let user = (req.body.username).toLowerCase()
//      let pass = req.body.password
//      let passConf = req.body.passConf
//      let name = req.body.name
//      let phone = req.body.phone
//      let email = req.body.email
//      let godown = req.body.godown
//      let shop_id = req.body.shop_id
//      if (user.length === 0 || pass.length === 0 || passConf.length === 0) {
//          req.flash('message', 'You must provide a username, password, and password confirmation.')
//          res.redirect('/main_admin_add_user')
//      } else if (pass != passConf) {
//          req.flash('message', 'Your password and password confirmation must match.')
//          res.redirect('/main_admin_add_user')
//      } else {
//          next()
//      }
//  } else {
//      res.redirect('/login')
//  }
//}, passport.authenticate('register', {
//  successRedirect : '/admin_logout',
//  failureRedirect : '/admin_logout',
//  failureFlash : true
//}))

//---------------------------------------------------------------//


//--------------------enable it for admin registration------------//
app.get('/admin_registration', (req, res) => {
  res.render('add_user');
})

app.post('/register', (req, res, next) => {
  
      //req.flash('message', 'You are already logged in.')
      //res.redirect('/profile')
      let user = (req.body.username).toLowerCase()
      let pass = req.body.password
      let passConf = req.body.passConf
      let name = req.body.name
      let phone = req.body.phone
      let email = req.body.email
      if (user.length === 0 || pass.length === 0 || passConf.length === 0) {
          req.flash('message', 'You must provide a username, password, and password confirmation.')
          res.redirect('/add_user')
      } else if (pass != passConf) {
          req.flash('message', 'Your password and password confirmation must match.')
          res.redirect('/add_user')
      } else {
          next()
      }
   
}, passport.authenticate('register', {
  successRedirect : '/add_user',
  failureRedirect : '/404-not-found',
  failureFlash : true
}))
