var request = require('request'); // "Request" library
var qb = require('append-query');
var mathdudes = require('./helpers/maths')
const fs = require('fs');
var valorantAgents = require('../jsons/valorant.json')
var valorantAgentsAnalysis = require('../jsons/valorant-analysis.json')

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

    app.get('/compare', async function (req, res) {
        console.log(valorantAgentsAnalysis)
        result = []
        for (character in valorantAgentsAnalysis){
            let agent = valorantAgentsAnalysis[character]
            let energy =  agent.analysis.map(item => item.energy).reduce((prev, next) => prev + next)/agent.analysis.length;
            let valence =  agent.analysis.map(item => item.valence).reduce((prev, next) => prev + next)/agent.analysis.length;
            let danceability =  agent.analysis.map(item => item.danceability).reduce((prev, next) => prev + next)/agent.analysis.length;
            let tempo =  agent.analysis.map(item => item.tempo).reduce((prev, next) => prev + next)/agent.analysis.length;
            let acousticness =  agent.analysis.map(item => item.acousticness).reduce((prev, next) => prev + next)/agent.analysis.length;
            let mode =  agent.analysis.map(item => item.mode).reduce((prev, next) => prev + next)/agent.analysis.length;
            result.push({name: agent.agent, energy: energy, valence: valence, danceability: danceability, tempo: tempo, acousticness: acousticness, mode: mode})
        }
        fs.writeFileSync('valorant-summary.json', JSON.stringify(result))

    })  


    app.get('/valorant', async function (req, res) {
        agentResults = []
        for (const agent in valorantAgents){
            var uri =  valorantAgents[agent];
            thing = await getValorantPlaylist(uri, req)
            var coolResults = await getStatBoys(thing, req)
            var sdfdfssdfsdfsdf = coolResults.audio_features
            var result = {agent: agent, analysis: sdfdfssdfsdfsdf}
            agentResults.push(result)

        }
        fs.writeFileSync('valorant-analysis.json', JSON.stringify(agentResults))
    })  

}

async function getStatBoys(thing, req){
    let url = 'https://api.spotify.com/v1/audio-features'
    var ids = thing.items.map(i => i.track.id).join(',');
    let params = {ids: ids}
    return new Promise(function(resolve){
        access_token = req.query.user;
        let filledUrl = qb(url, params);
        var options = {
            url: filledUrl,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }
        request.get(options, function(error, response, body) {
            resolve(body);
            
        });
    });
}


async function getValorantPlaylist(uri, req){
    return new Promise(function(resolve){
        access_token = req.query.user;
        let url = `https://api.spotify.com/v1/playlists/${uri}/tracks`
        var options = {
            url: url,
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }
        request.get(options, function(error, response, body) {
            resolve(body);
            
        });
    })
   
}
    
