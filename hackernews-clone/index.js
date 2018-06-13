var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator")
var mongojs = require('mongojs')
var db = mongojs('userapp', ['users']);
var submitdb = mongojs('submitpost', ['posts']);

var app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
});

app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//something


app.get('/login', function(req, res, docs) {
  res.render('index');
})

app.get('/submit', function(req, res, docs) {
  res.render('submit');
})

app.get('/', function(req, res) {
      submitdb.posts.find(function(err, docs) {
        res.render('home', {
          title: 'posts',
          posts: docs,
        });
      })
    })

      app.post('/login', function(req, res, docs) {
        db.users.find(function(err, docs) {
          var checkname = req.body.uname;
          var checkpass = req.body.password;
          for (var i = 0; i < docs.length; i++) {

            if (checkname == docs[i]['name'] && checkpass == docs[i]['password']) {
              console.log("authentication SUCCESS");
              res.redirect('/')
            }
          }
        })
      })

      app.post('/register', function(req, res, docs) {

        req.checkBody('cname', 'name is required').notEmpty();
        req.checkBody('cpassword', 'password is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
          res.render('index', {
            title: 'customers',
            users: docs,
            errors: errors,

          });
        } else {
          var newuser = {
            name: req.body.cname,
            password: req.body.cpassword,
          }
          db.users.insert(newuser, function(err, result) {
            if (err) {} else {
              res.redirect('/');
            }
          });
        }
      })

      app.post('/r', function(req, res, docs) {

        req.checkBody('title', 'title is required').notEmpty();
        req.checkBody('text', 'text is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
          res.render('submit', {
            title: 'posts',
            posts: docs,
            errors: errors,

          });
        } else {
          var newpost = {
            title: req.body.title,
            text: req.body.text,
          }
          //  console.log(newpost);
          submitdb.posts.insert(newpost, function(err, result) {
            if (err) {} else {
              res.redirect('/');
            }
          });
        }



        // submitdb.posts.find(function(err,docs) {
        // console.log(docs);
        // })

      })

      app.listen(port, function() {});
