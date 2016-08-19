var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require('../models/User.js');

// Rota para retornar a lista de usuários
router.get('/', function(req, res){
  User.find(
    {}, //Filtros ou WHERE, neste caso não temos nenhum filtro
    "_id name email", //Campos que serão retornados da nossa consulta
    function(err, data){ // Função que será executada quando a consulta terminar. Ela retorna os dados para o cliente
      res.json(data);
    }
  )
});

// Rota para pegar um usuário pelo :ID
router.get('/:id', function(req, res, next) {
  User.findById(req.params.id,'_id name email', function(err, user){
    if(err){
      res.status(500);
    }else{
      res.json({user: user});
    }
  });
});

// Rota para registro de um novo usuário
router.post('/sign_up', function(req, res){
  var new_user = new User(req.body);
  new_user.save(function(err, data){
    if(err){
      res.status(400).json(err);
    }else{
      res.json(data);
    }
  });
});

// Rota para realizar Login
router.post('/sign_in', function(req, res){
  //Procura pelo usuario no banco
  User.findOne({username: req.body.username}, function(err, user){
    if(user === null || err){
      // Se não encontrar o usuário ou ocorrer algum erro retorna um erro
      res.status(401).json({message: 'User or Password invalid!'});
    }else{
      //Verifica a senha
      user.verifyPassword(req.body.password, function(err, match){
        if(err || !match){
          // Se não for igual ou ocorrer algum erro na verificação, retorna um erro
          res.status(401).json({message: 'User or Password invalid!'});
        }else{
          var params = {
            _id: user._id
            name: user.name,
            username: user.username,
            email: user.email
          }
          //Gera o token com os paramentros e a chave
          user.token = jwt.sign(params, "segredo");
          //Retorna as informações do usuário e o token
          res.json({token: user.token, user: params});
        }
      });
    }
  });
});

router.post('/valid_token', function(req, res, next) {
  User.findOne({token: req.body.token}, function(err, user){
    if(err) { res.status(401).json({ type: false, data: "User not found!"}); return ; }
    if(user) {
      res.json({type: true, data: user}); return ;
    }else{
      res.status(401).json({ type: false, data: "User not found!"});
      return ;
    }
  });
});

module.exports = router;