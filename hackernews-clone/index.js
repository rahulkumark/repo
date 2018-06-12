var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator")
var mongojs = require('mongojs')
var db = mongojs('userapp', ['users']);

var app = express();
const port = 3000;

// var requestTime = function (req, res, next) {
//   req.requestTime = Date.now()
//   next()
// }
//
// app.use(requestTime)

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// view engine

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//global variables
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();

});

//expressValidator middleware

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

// var users = [
//   {
//     name : 'RK',
//     password : 1,
//   },
//   {
//     name : 'PT',
//     password : 2,
//   },
//   {
//     name : 'vikas',
//     password : 3,
//   }
// ]

app.get('/', function(req, res,docs) {

  res.render('index');

})

app.post('/users/login', function(req, res ,docs) {

  db.users.find(function(err, docs) {

    var checkname = req.body.uname;
    var checkpass = req.body.password;

    // console.log(checkname,checkpass);

    for (var i = 0; i < docs.length; i++) {

      if (checkname == docs[i]['name'] && checkpass == docs[i]['password']){

        console.log("authentication SUCCESS");
        // console.log(checkname,checkpass);
        // console.log(docs[i]['name'],docs[i]['password']);
        break ;


      }
      // else {
      //   // console.log(checkname,checkpass);
      //   // console.log(docs[i]['name'],docs[i]['password']);
      //   console.log("auth error");
      // }
    }


  })

res.redirect('/');


})

app.post('/users/register', function(req, res ,docs) {

  req.checkBody('cname', 'name is required').notEmpty();
  req.checkBody('cpassword', 'password is required').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.render('index', {
      title: 'customers',
      users: docs,
      errors: errors,

    });
    // console.log("ERROR");

  } else {
    var newuser = {
      name: req.body.cname,
      password: req.body.cpassword,
    }

    // console.log(newuser);

    db.users.insert(newuser, function(err, result) {
      if (err) {
        // console.log(err);
      } else {
        res.redirect('/');
      }

    })
  }
  // console.log(newuser);
})


app.listen(port, function() {
  // console.log(`server started on port ${port}`);
});
