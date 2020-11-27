const fs = require('fs');

module.exports = function(app){

    
    app.get('/connectToJson', function(req, res) {
    fs.readFile('./jsons/test.json', 'utf8', function(err, data){
        console.log(data)
        res.json(JSON.parse(data))
    });
    });
}