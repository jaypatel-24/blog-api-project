module.exports = (req, res, next ) => {
    if (!req.user) {
        req.flash('errorMsg', "You must be logged in to perform that action")
        res.redirect('/login')
    }
    next()
}