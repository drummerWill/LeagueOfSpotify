const fs = require('fs');
var helpmethods = require('./helpers/test')

module.exports = function(app){

    
    app.get('/connectToJson', function(req, res) {
    fs.readFile('./jsons/test.json', 'utf8', function(err, data){
        res.json(JSON.parse(data))
    });
    });
}