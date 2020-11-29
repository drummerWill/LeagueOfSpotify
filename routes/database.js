const fs = require('fs');
var helpmethods = require('./helpers/test')

module.exports = function(app){

    
    app.get('/getGoonsList', function(req, res) {
        fs.readFile('./goons.json', 'utf8', function(err, data){
            res.json(JSON.parse(data))
        });
        });


    app.get('/connectToJson', function(req, res) {
    fs.readFile('./jsons/test.json', 'utf8', function(err, data){
        res.json(JSON.parse(data))
    });
    });
}