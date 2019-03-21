const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
	authorId: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	subtitle: {
		type: String
	},
	content: {
		type: String,
		required: true
	},
	upvoters: [String],
	downvoters: [String],
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Post', PostSchema, 'posts');