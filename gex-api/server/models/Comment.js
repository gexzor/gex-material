const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	authorId: {
		type: String,
		required: true
	},
	parentId: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	comments: [String],
	upvoters: [String],
	downvoters: [String],
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Comment', CommentSchema, 'comments');