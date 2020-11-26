var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();


// var con = mysql.createConnection({
//   host: "localhost",
//   user: "william",
//   password: "admin"
// });


// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

app.use(express.static('public', {extensions:['html']})).use(cors())
.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
require('./routes/authentication')(app);
// require('./routes/database')(app, con);
require('./routes/spotify')(app);





  app.listen(process.env.PORT || 3000, function() {
});