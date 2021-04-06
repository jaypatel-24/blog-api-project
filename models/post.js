var mongoose = require('mongoose');
const Comment = require('./Comment');
const moment = require('moment')

//Define a schema
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  	title: {type: String, required: true},
	content: {type: String, required: true},
  	comments: {type: Array},
	username: {type: String, required: true},
	published: {type: Boolean, required: true},
    creationTime: {type: Date}
});

// Virtual for formatted date
PostSchema
.virtual('formattedCreationTime')
.get(function() {
	return moment(this.creationTime).format('MMM Do YYYY, h:mm')
})

//Export model
module.exports = mongoose.model('Post', PostSchema);