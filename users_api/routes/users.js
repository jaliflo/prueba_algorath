var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().exec(function(err, list){
    if(err) {
      next(err);
      return;
    }

    res.json({ok: true, list: list});
  });
});

// POST create user.
router.post('/', function(req, res, next){
  var user = new User(req.body);
  user.save(function(err, savedUser){
    if(err) {
      next(err);
      return;
    }

    res.json({
      ok: true,
      user: savedUser
    })
  });
});

// PUT connect two users.
router.put('/connect', function(req, res, next){
  var userName1 = req.body.name1;
  var userName2 = req.body.name2;

  console.log(userName1, userName2);
  
  User.find({$or: [{name: userName1}, {name: userName2}]}).exec(function(err, users){
    if(err) {
      next(err);
      return;
    }

    console.log(users[0].name, users[1].name);

    userName1 = users[0].name;
    userName2 = users[1].name;

    var connections1 = users[0].connections;
    var connections2 = users[1].connections;

    console.log(userName1, userName2);

    if(connections1.indexOf(userName2) === -1 && userName2 !== users[0].name){
      connections1.push(userName2);
      console.log(connections1);
      User.update({name: userName1}, {$set: {connections: connections1}}, function(err, user1){
        if(err) {
          next(err);
          return;
        }

        connections2.push(userName1);
        console.log(connections2);
        User.update({name: userName2}, {$set: {connections: connections2}}, function(err, user2){
          if(err) {
            next(err);
            return;
          }

          res.json({
            ok: true,
            users: {
              user1: user1,
              user2: user2
            }
          })
        });

      });
    }else {
      res.json({
        ok: true,
        users: {
          user1: users[0],
          user2: users[1]
        }
      })
    }
  });
});

// GET all users connected to someone
router.get('/:name', function(req, res, next){
  User.findOne({name: req.params.name}).exec(function(err, user){
    if(err) {
      next(err);
      return;
    }

    if(user === null){
      var err = {};
      err.message = "User does not exist";
      next(err);
      return;
    }

    User.find({name: {$in: user.connections}}, function(err, list){
      if(err) {
        next(err);
        return;
      }

      res.json({
        ok: true,
        users: list
      });
    });
  })
});


module.exports = router;
