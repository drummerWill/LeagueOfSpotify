var request = require('request'); // "Request" library
var qb = require('append-query');

module.exports = function(app){
    
    app.get('/userinfo', function (req, res) {
        access_token = req.query.user;
        console.log("requested user info");
        var options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
            };
  
          // use the access token to access the Spotify Web API
          request.get(options, function(error, response, body) {
              res.json(body)
          });
    });

    app.get('/usertop', function (req, res) {
        params = {time_range: 'long_term'}
        access_token = req.query.user;
        var options = {
            url: qb('https://api.spotify.com/v1/me/top/artists', params),
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }
        request.get(options, function(error, response, body) {
            dudes = body.items;
            genres = dudes.map(d => d.genres).flat()
            console.log(genres)
            console.log(body)
            res.json(body)
        });
    })



}
    