var request = require('request'); // "Request" library

module.exports = function(app){
    
    app.get('/userinfo', function (req, res) {
        access_token = req.query.user;
        console
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
}
    