const express = require('express');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
// 	extended: true
// }));

const api = require('./routes/api');

app.use('/api', api);

app.get('/', function (req, res) {
	res.send('Hello from sever!');
});

app.listen(PORT, function () {
	console.log('Server running on localhost:' + PORT);
});

