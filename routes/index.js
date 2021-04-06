var express = require('express');
var router = express.Router();

const Post = require("../models/post")


router.get('/', async (req, res, next) => {

  const posts = await Post.find({}).sort({creationTime: "desc"})
  
  res.render('index', { title: "Blog Api", posts });
});


module.exports = router;
