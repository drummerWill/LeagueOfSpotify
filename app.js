var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

var con = mysql.createConnection({
    host: "localhost",
    user: "william",
    password: "admin"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("SELECT * FROM mysql.user", function (err, result) {
        if (err) throw err;
        console.log(result);
      });
  });

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/testingAngular.js');
    res.sendFile(__dirname + '/index.html');
});


app.get('/new', function (req, res) {
    a = {name: "william", age: 21};
    res.json(a);
});

  app.listen(process.env.PORT || 3000, function() {
});