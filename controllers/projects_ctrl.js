var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var Project = require('../models/Project.js');

router.use(function(req, res, next) {
  if (req.headers['authorization']) {
    jwt.verify(req.headers['authorization'], "segredo", function(err, decoded) {
      if (err) {
        res.status(400).json({ success: false, message: 'Failed to authenticate token.', err: err });
      }else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

// define the home page route
router.get('/', function(req, res) {
  Project.find(
          { $or:[ // operador OR no mongoose
            {creator: req.decoded._id}, // Ou o usuário é o criador do Projeto e portanto o dono
            {team: { $in: [req.decoded._id] }} // Ou ele faz parte da equipe do projeto
          ] },
          function(err, projects){
            if(err){
              return res.status(500).json(err);
            }
            res.json({ projects: projects });
          })
});

// Rota para criar novos projetos
router.post('/', function(req, res) {
  for (i in req.body.boards) {
    req.body.boards[i].creator = req.decoded._id;
    for (x in req.body.boards[i].tasks) {
      req.body.boards[i].tasks[i].creator = req.decoded._id;
    }
  }
  var project = new Project(req.body);
  project.creator = req.decoded._id;
  project.save(function(err, proj) {
    if(err){
      return res.status(400).json(err);
    }
    res.json({ project: proj });
  });
});

// Rota para atualizar projeto
router.put('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){ return res.status(500).json(err); }
    if(project === null || project === undefined){ return res.status(404).send({ success: false, message: 'Project not found.' }); }
    project.name = req.body.name;
    project.description = req.body.description;
    project.team = req.body.team;
    for (i in req.body.boards) {
      if(req.body.boards[i].creator === undefined)
        req.body.boards[i].creator = req.decoded._id;
      for (x in req.body.boards[i].tasks) {
        if(req.body.boards[i].tasks[i].creator === undefined)
          req.body.boards[i].tasks[i].creator = req.decoded._id;
      }
    }
    project.boards = req.body.boards;
    project.save(function(err, proj) {
      if(err){ return res.status(500).json({error: err}); }
      res.json({ project: proj });
    });

  });
});

// Rota para retornar um projeto pelo seu _id
router.get('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){ return res.status(500).json(err); }
    res.json({ project: project });
  })
});


module.exports = router;