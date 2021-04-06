var express = require('express')
var router = express.Router();
var moment = require('moment')

const checkLoggedIn =  require('../middlewares/loginCheck')
var Post = require('../models/post')
var Comment = require('../models/comment')

//create posts get
router.get('/', checkLoggedIn, function(req, res, next) {
    res.render('post', { title: "Create Post" });
  });

///create post POST  
router.post('/', checkLoggedIn, function(req, res, next) {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        comments: [],
        username: req.user.username,
        published: req.body.published,
        creationTime: new Date()
    })

    post.save( (err, post) => {
        if (err) return next(err)
        console.log(`Post ${post.title} Added to DB`)
        res.redirect('../')
    })
  });  


// GET individual post
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id, (err, post) => {
      if (err) return next (err)
      res.render('singlePost', {post, title: "Blog Api"})
  })
})


// POST post comment
router.post('/:id/comments', checkLoggedIn, async (req, res, next) => {
  const post = Post.findById(req.params.id).exec();
  const comments = post.comments

  const newComment = new Comment({
      username: req.user.username,
      content: req.body.content,
      creationTime: new Date(),
      formattedCreationTime: moment().format('MMM Do YYYY, h:mm')
  })

  comments.push(newComment)

  Post.findByIdAndUpdate(req.params.id, {comments}, (err, blog) => {
      if (err) return next(err)
      req.flash("successMsg", "Comment posted!")
      res.redirect(`/posts/${req.params.id}`)
  })
})


// GET: get edit post
router.get('/edit/:id', checkLoggedIn, async (req, res, next) => {
  const post = Post.findById(req.params.id);
  
  console.log(req.body.username + " " + post.username)
  if (req.user.username != post.username) {
      req.flash('errorMsg', "You cannot edit another user's post")
      res.redirect('/')
  } else {
    res.render('updatePost', {post, title: "Update Post"})
  }
})



// POST: edit post
router.post('/edit/:id', checkLoggedIn, async (req, res, next) => {

  const post = Post.findById(req.params.id)
  
  if (req.user.username != post.username) {
      req.flash('errorMsg', "You cannot edit another user's post")
      res.redirect('/')
  }

  Post.findByIdAndUpdate(req.params.id, 
      {
          title: req.body.title,
          content: req.body.content,
          published: req.body.published,
          creationTime: new Date()
      },
      (err, post) => {
          if (err) return next(err)
          if (req.body.published === "true") {
              req.flash('successMsg', "Post updated!")
          } else {
              req.flash('successMsg', "Post saved for later!")
          }
          res.redirect('/')
      })
})

// DELETE:  delete post
router.get('/delete/:id', checkLoggedIn, async (req, res, next) => {

  var post = Post.findById(req.params.id)
  console.log(req.params.id)
  console.log(post.title + " " + post.username)

  if (req.user.username != post.username) {
      req.flash('errorMsg', "You cannot delete another user's post")
      res.redirect('/')
  } else {
        Post.findByIdAndRemove(req.params.id, (err) => {
        if (err) return next(err);
        req.flash('successMsg', "Post deleted!")
        res.redirect('/')
    })
  }

})


// GET unpublished posts page
router.get('/saved', checkLoggedIn, (req, res, next) => {
    Post.find({username: req.user.username, published: false}, (err, posts) => {
        if (err) return next(err)
        res.render('unpublishedPosts', {posts, title: "Blog Api"})
    })
})



module.exports = router  