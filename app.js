var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var app = express();
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/trello');
var User = require('./models/User.js');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/users', function(req, res){
	User.find(
		{}, //Filtros ou WHERE 
		"_id name email", //Campos
		function(err, data){
			res.json(data);
		}
	)
});

app.post('/users', function(req, res){
	var new_user = new User(req.body);
	new_user.save(function(err, data){
		if(err){
			res.json(err);
		}else{
			res.json(data);
		}
	});
});

app.post('/login', function(req, res){
	User.findOne(
		{username: req.body.username}, 
		function(err, user){
			console.log(user);
			console.log(err);
			if(user === null || err){
				res.status(401).json({message: 'User or Password invalid!'});
			}else{
				user.verifyPassword(
					req.body.password,
					function(err, match){
						if(err || !match){
							res.status(401).json({message: 'User or Password invalid!'});
						}else{
							var params = {name: user.name,
										  username: user.username,
										  email: user.email}
							user.token = jwt.sign(params, "segredo");
							res.json({token: user.token, user: params});
						}
					});
			}
		});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});