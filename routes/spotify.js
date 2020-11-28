var request = require('request'); // "Request" library
var qb = require('append-query');
var mathdudes = require('./helpers/maths')
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
              console.log(body)
              res.json(body)
          });
    });

    app.get('/usertop', function (req, res) {
        params = {time_range: 'long_term', limit: 50}
        access_token = req.query.user;
        var options = {
            url: qb('https://api.spotify.com/v1/me/top/tracks', params),
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }
        request.get(options, function(error, response, body) {
            tracks = body.items;
            data = {dates: []}
            
            tracks.forEach(track => {
                let date = new Date(track.album.release_date)
                let options = mathdudes.getYears(date.getFullYear());
                data.dates.push({name: track.name, correctYear: date.getFullYear(), options: options})
            });

            res.json(data)
        });
    })





}
    