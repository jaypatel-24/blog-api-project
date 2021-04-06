var express = require('express');
var router = express.Router();
const passport = require("passport")

const Post = require("../models/post")


router.get('/', function(req,res) {
    res.render("login", {title: "Blog Api", message: []});
})

router.post('/', 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    })
)

module.exports = router;
