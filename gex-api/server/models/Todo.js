const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
	authorId: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	status: {
		type: String,
		enum: ['TODO', 'DOING', 'DONE'],
		required: true,
		default: 'TODO'
	},
	created: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Todo', TodoSchema, 'todos');