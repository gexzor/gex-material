const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Todo = require('../models/Todo');
const mongoose = require('mongoose');
const config = require('../server-config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(config.database, config.options, error => {
	if (error) {
		console.log(error);
	} else {
		console.log('Connected to MongoDB');
	}
});

router.get('/', (req, res) => {
	res.send('From API route');
});

function verifyToken(req, res, next) {
	if (!req.headers.authorization) return res.status(401).send('Unauthorized request');
	let token = req.headers.authorization.split(' ')[1];
	if (token === 'null') return res.status(401).send('Unauthorized request');
	let payload = jwt.verify(token, config.secret);
	if (!payload) return res.status(401).send('Unauthorized request');
	req.userId = payload.subject;
	next();
}

// Register
router.post('/register', (req, res) => {
	let user = new User(req.body);
	user.save((error, registeredUser) => {
		if (error) {
			console.log(error);
		} else {
			let payload = { subject: registeredUser._id };
			let token = jwt.sign(payload, config.secret);
			res.status(200).send({ token });
		}
	});
});

// Login
router.post('/login', (req, res) => {
	let userData = req.body;
	User.findOne({ email: userData.email }, (error, user) => {
		if (error) console.log(error);
		else if (!user) res.status(401).send('Invalid email');
		else if (user.password !== userData.password) res.status(401).send('Invalid password');
		else {
			let payload = { subject: user._id };
			let token = jwt.sign(payload, config.secret);
			res.status(200).send({ token, userId: user._id, username: user.username });
		}
	});
});

// GET ALL USERS (accessed by GET at http://localhost:3000/api/users)
router.get('/users', verifyToken, (req, res) => {
	User.find((error, users) => {
		if (error) console.log(error);
		else if (!users) res.status(204).send('No users found');
		else res.status(200).send(users);
	});
});

// GET USER BY ID (accessed by GET at http://localhost:3000/api/users/:id)
router.get('/users/:id', verifyToken, (req, res) => {
	let userId = req.params.id;
	User.findById(userId, (error, user) => {
		if (error) console.log(error);
		else if (!user) res.status(204).send('No user found');
		else res.status(200).send(user);
	});
});

// UPVOTE USER BY ID (accessed by PUT at http://localhost:3000/api/users/upvote/:id)
router.put('/users/upvote/:id', (req, res) => {
	let userId = req.params.id;
	let voterId = req.body.voterId;
	User.findOne({ _id: userId }, (error, user) => {
		let upvoters = user.upvoters;
		let downvoters = user.downvoters;
		if (error) console.log(error);
		else if (!user) res.status(204).send('No user found');
		// Remove upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
		}
		// Remove downvote and create upvote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
			upvoters.push(voterId);
		}
		// If none then create upvote
		else upvoters.push(voterId);
		user.save((error, user) => {
			if (error) console.log(error);
			else res.status(200).send(user);
		})
	});
});

// DOWNVOTE USER BY ID (accessed by PUT at http://localhost:3000/api/users/downvote/:id)
router.put('/users/downvote/:id', (req, res) => {
	let userId = req.params.id;
	let voterId = req.body.voterId;
	User.findOne({ _id: userId }, (error, user) => {
		let downvoters = user.downvoters;
		let upvoters = user.upvoters;
		if (error) console.log(error);
		else if (!user) res.status(204).send('No user found');
		// Remove existing vote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
		}
		// Remove upvote and create upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
			downvoters.push(voterId);
		}
		// Create new vote
		else downvoters.push(voterId);
		user.save((error, user) => {
			if (error) console.log(error);
			else res.status(200).send(user);
		})
	});
});

// DELETE USER (accessed by DELETE at http://localhost:3000/api/users/:id)
router.delete('/users/:id', (req, res) => {

	userId = req.params.id;
	console.log(userId);

	User.findByIdAndRemove(userId, req.body, (error, user) => {
		if (error) res.status(500).send(error);
		else {
			response = {
				message: `User #${userId} successfully deleted.`
			};
			res.status(200).send(response);
		}
	});
});


/*
* POSTS
*/


// GET ALL POSTS (accessed by GET at http://localhost:3000/api/posts)
router.get('/posts', (req, res) => {
	Post.find((error, posts) => {
		if (error) console.log(error);
		else if (!posts) res.status(204).send('No posts found');
		else res.status(200).send(posts);
	});
});


// GET POST BY ID (accessed by GET at http://localhost:3000/api/posts/:id)
router.get('/posts/:id', verifyToken, (req, res) => {
	let postId = req.params.id;
	Post.findById(postId, (error, post) => {
		if (error) console.log(error);
		else if (!post) res.status(204).send('No post found');
		else res.status(200).send(post);
	});
});


// CREATE POST (accessed by POST at http://localhost:3000/api/posts)
router.post('/posts', (req, res) => {
	let post = new Post(req.body);
	post.save((error, post) => {
		if (error) console.log(error);
		else res.status(200).send(post)
	});
});


// UPVOTE POST BY ID (accessed by PUT at http://localhost:3000/api/posts/upvote/:id)
router.put('/posts/upvote/:id', (req, res) => {
	let postId = req.params.id;
	let voterId = req.body.voterId;
	Post.findOne({ _id: postId }, (error, post) => {
		let upvoters = post.upvoters;
		let downvoters = post.downvoters;
		if (error) console.log(error);
		else if (!post) res.status(204).send('No post found');
		// Remove upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
		}
		// Remove downvote and create upvote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
			upvoters.push(voterId);
		}
		// If none then create upvote
		else upvoters.push(voterId);
		post.save((error, post) => {
			if (error) console.log(error);
			else res.status(200).send(post);
		})
	});
});


// DOWNVOTE POST BY ID (accessed by PUT at http://localhost:3000/api/posts/downvote/:id)
router.put('/posts/downvote/:id', (req, res) => {
	let postId = req.params.id;
	let voterId = req.body.voterId;
	Post.findOne({ _id: postId }, (error, post) => {
		let downvoters = post.downvoters;
		let upvoters = post.upvoters;
		if (error) console.log(error);
		else if (!post) res.status(204).send('No post found');
		// Remove existing vote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
		}
		// Remove upvote and create upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
			downvoters.push(voterId);
		}
		// Create new vote
		else downvoters.push(voterId);
		post.save((error, post) => {
			if (error) console.log(error);
			else res.status(200).send(post);
		})
	});
});


// DELETE POST (accessed by DELETE at http://localhost:3000/api/posts/:id)
router.delete('/posts/:id', (req, res) => {
	postId = req.params.id;

	Post.findByIdAndRemove(postId, req.body, (error, post) => {
		if (error) res.status(500).send(error);
		else {
			response = {
				message: `Post #${postId} successfully deleted.`
			};
			res.status(200).send(response);
		}
	});
});


/*
* COMMENTS
*/


// GET ALL COMMENTS (accessed by GET at http://localhost:3000/api/comments/id)
router.get('/comments/:id', (req, res) => {
	let parentId = req.params.id;
	Comment.find({ parentId: parentId }, (error, comments) => {
		if (error) console.log(error);
		else if (!comments) res.status(204).send('No comments found');
		else res.status(200).send(comments);
	});
});


// CREATE COMMENT (accessed by POST at http://localhost:3000/api/comments/id)
router.post('/comments', (req, res) => {
	let comment = new Comment(req.body);
	comment.save((error, comment) => {
		if (error) console.log(error);
		else res.status(200).send(comment)
	});
});


// UPVOTE COMMENT BY ID (accessed by PUT at http://localhost:3000/api/comments/upvote/:id)
router.put('/comments/upvote/:id', (req, res) => {
	let commentId = req.params.id;
	let voterId = req.body.voterId;
	Comment.findOne({ _id: commentId }, (error, comment) => {
		let upvoters = comment.upvoters;
		let downvoters = comment.downvoters;
		if (error) console.log(error);
		else if (!comment) res.status(204).send('No comment found');
		// Remove upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
		}
		// Remove downvote and create upvote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
			upvoters.push(voterId);
		}
		// If none then create upvote
		else upvoters.push(voterId);
		comment.save((error, comment) => {
			if (error) console.log(error);
			else res.status(200).send(comment);
		})
	});
});


// DOWNVOTE COMMENT BY ID (accessed by PUT at http://localhost:3000/api/comments/downvote/:id)
router.put('/comments/downvote/:id', (req, res) => {
	let commentId = req.params.id;
	let voterId = req.body.voterId;
	Comment.findOne({ _id: commentId }, (error, comment) => {
		let downvoters = comment.downvoters;
		let upvoters = comment.upvoters;
		if (error) console.log(error);
		else if (!comment) res.status(204).send('No comment found');
		// Remove existing vote
		else if (downvoters.indexOf(voterId) > -1) {
			let index = downvoters.indexOf(voterId);
			downvoters.splice(index, 1);
		}
		// Remove upvote and create upvote
		else if (upvoters.indexOf(voterId) > -1) {
			let index = upvoters.indexOf(voterId);
			upvoters.splice(index, 1);
			downvoters.push(voterId);
		}
		// Create new vote
		else downvoters.push(voterId);
		comment.save((error, comment) => {
			if (error) console.log(error);
			else res.status(200).send(comment);
		})
	});
});


// DELETE COMMENT (accessed by DELETE at http://localhost:3000/api/comments/:id)
router.delete('/comments/:id', (req, res) => {
	commentId = req.params.id;
	Comment.findByIdAndRemove(commentId, req.body, (error, comment) => {
		if (error) res.status(500).send(error);
		else {
			response = { message: `Comment #${commentId} successfully deleted.` };
			res.status(200).send(response);
		}
	});
});


/*
* TODOS
*/


// GET ALL TODOS (accessed by GET at http://localhost:3000/api/todos/id)
router.get('/todos/:id', (req, res) => {
	let authorId = req.params.id;
	Todo.find({ authorId: authorId }, (error, todos) => {
		if (error) console.log(error);
		else if (!todos) res.status(204).send('No todos found');
		else res.status(200).send(todos);
	});
});


// CREATE TODO (accessed by POST at http://localhost:3000/api/todos/id)
router.post('/todos', (req, res) => {
	let todo = new Todo(req.body);
	todo.save((error, todo) => {
		if (error) console.log(error);
		else res.status(200).send(todo)
	});
});


// SET STATUS OF TODO (accessed by PUT at http://localhost:3000/api/todos/setstatus/:id)
router.put('/todos/setstatus/:id', (req, res) => {
	console.log('Doing stuff on server');

	let todoId = req.params.id;
	let todoStatus = req.body.status;
	Todo.findOne({ _id: todoId }, (error, todo) => {
		if (error) console.log(error);
		else if (!todo) res.status(204).send('No todo found');
		// Check todo status format
		else if (todoStatus === 'TODO' || todoStatus === 'DOING' || todoStatus === 'DONE') {
			// Set new todo status
			todo.status = todoStatus;
			todo.save((error, todo) => {
				if (error) console.log(error);
				else res.status(200).send(todo);
			});
		}
		else res.status(400).send('Malformat todo status string');
	});
});


// DELETE TODO (accessed by DELETE at http://localhost:3000/api/todos/:id)
router.delete('/todos/:id', (req, res) => {
	todoId = req.params.id;
	Todo.findByIdAndRemove(todoId, req.body, (error, todo) => {
		if (error) res.status(500).send(error);
		else {
			response = { message: `Todo #${todoId} successfully deleted.` };
			res.status(200).send(response);
		}
	});
});


module.exports = router;