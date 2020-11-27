var mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();


app.use(express.static('public', {extensions:['html']})).use(cors())
.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
require('./routes/authentication')(app);
require('./routes/database')(app);
require('./routes/spotify')(app);


process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err)
})


  app.listen(process.env.PORT || 3000, function() {
});