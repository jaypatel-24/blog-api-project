
const {body, validationResult} = require('express-validator');

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bcrypt = require('bcryptjs');

var userController = require('../controllers/userController');

router.post('/logout', function(req,res,next) {
  req.logout();
  res.redirect('/');
})

/* GET users listing. */
router.get('/signup', function(req,res,next) {
  res.render('signup',{title: "sign up", message: []});
});

router.post('/signup', [
 // Validate and sanitise fields
 body('username', 'Username is required').trim().isLength({min: 1}).escape(),
 body('firstName', 'First name is required').trim().isLength({min: 1}).escape(),
 body('lastName', 'Last name is required').trim().isLength({min: 1}).escape(),
 body('password', 'Password does not meet criteria').trim().isLength({min: 8}).escape(),
 async(req, res, next) => {
   // Extract validation errors

   const errors = validationResult(req).array();
   console.log(req.body.password2);

   const fieldsUnfilled = !req.body.firstName || !req.body.lastName|| !req.body.username|| !req.body.password|| !req.body.password2
   if (fieldsUnfilled) {
     console.log("unfilled")
     // errors.push("Must fill out all fields")
     res.render('signup', 
       {
         title: "Create account", 
         errors,
         fields: {
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           username: req.body.username.toLowerCase()
         }
       })
   } else {
     const usernameExists = await User.findOne({username: req.body.username}).exec()
     const passwordsMatch = req.body.password === req.body.password2
   
     if (usernameExists) {
       console.log("username exists")
       errors.push({msg: "Username already exists"})
     } 
     if (!passwordsMatch) {
      console.log("password didnt match")
       errors.push({msg: "Passwords do not match"})
     }
     if (!usernameExists & passwordsMatch) {
      console.log("everytgs good")
       bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
 
         if (err) return next(err)
 
         const newUser = new User({
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           username: req.body.username.toLowerCase(),
           password: hashedPassword
         })
     
         newUser.save( (err, user) => {
           if (err) return next(err)
           req.flash('successMsg', "Account successfully created. Log in to start blogging!")
           res.redirect('/')
         })
       })
 
     }
     else {
       res.render('signup', 
       {
         title: "Create account",
         errors,
         fields: {
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           username: req.body.username.toLowerCase()
         }
       })
     }
   }

 }
])


  
module.exports = router;
