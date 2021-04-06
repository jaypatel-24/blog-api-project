const LocalStrategy = require("passport-local").Strategy
const User = require("../models/user")
const bcrypt = require('bcryptjs')


module.exports = {
    passportAuthentication:
     new LocalStrategy( (username, password, done) => {
        username = username.toLowerCase()
        User.findOne({username}, (err, user) => {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, {message: "Username does not exist"})
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) return console.log(err)
                if (!res) {
                    return done(null, false, {message: "Username and password do no match"})
                }
                return done(null, user)
            })
        })
    }),

    serialize: (user, done) => {
        done(null, user.id)
    },

    deserialize: (id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    }
}