var request = require('request'); // "Request" library
var qb = require('append-query');
var mathdudes = require('./helpers/maths')
const fs = require('fs');
var valorantAgents = require('../jsons/valorant.json')
var valorantAgentsAnalysis = require('../jsons/valorant-analysis.json')
var valorantSummary = require('../jsons/valorant-summary.json')
var goons = require('../goons.json')
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

    app.get('/usertop', async function (req, res) {
        var tracks = await getSongs(req);
            data = {dates: []}
            
            tracks.forEach(track => {
                let date = new Date(track.album.release_date)
                let options = mathdudes.getYears(date.getFullYear());
                data.dates.push({name: track.name, correctYear: date.getFullYear(), options: options})
            });

            res.json(data);
    });


    app.get('/compare', async function (req, res) {
        var userInfo = await getUserInfo(req)
        var name = userInfo.display_name;
        var tracks = await getSongs(req);
        var ids = tracks.map(i => i.id).join(',');
        var stats = await getStatBoys(ids, req);
        var toCompare = decomposeFeatures(stats.audio_features, name)

        if (goons.filter(g => g.name === name).length === 0){
            goons.push(toCompare)            
            fs.writeFileSync('goons.json', JSON.stringify(goons))
        }

        
        var result = compare(toCompare, valorantSummary)
        var sortedResult = result.sort(function (a, b) {
            return a.dif - b.dif;
          });
        res.json(sortedResult)
    })


    // app.get('/compare', async function (req, res) {
    //     console.log(valorantAgentsAnalysis)
    //     result = []
    //     for (character in valorantAgentsAnalysis){
    //         let agent = valorantAgentsAnalysis[character]
    //         let energy =  agent.analysis.map(item => item.energy).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         let valence =  agent.analysis.map(item => item.valence).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         let danceability =  agent.analysis.map(item => item.danceability).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         let tempo =  agent.analysis.map(item => item.tempo).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         let acousticness =  agent.analysis.map(item => item.acousticness).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         let mode =  agent.analysis.map(item => item.mode).reduce((prev, next) => prev + next)/agent.analysis.length;
    //         result.push({name: agent.agent, energy: energy, valence: valence, danceability: danceability, tempo: tempo, acousticness: acousticness, mode: mode})
    //     }
    //     fs.writeFileSync('valorant-summary.json', JSON.stringify(result))

    // })  


    // app.get('/valorant', async function (req, res) {
    //     agentResults = []
    //     for (const agent in valorantAgents){
    //         var uri =  valorantAgents[agent];
    //         thing = await getValorantPlaylist(uri, req)
    //         var coolResults = await getStatBoys(thing, req)
    //         var sdfdfssdfsdfsdf = coolResults.audio_features
    //         var result = {agent: agent, analysis: sdfdfssdfsdfsdf}
    //         agentResults.push(result)

    //     }
    //     fs.writeFileSync('valorant-analysis.json', JSON.stringify(agentResults))
    // })  

}

async function getStatBoys(ids, req){
    let url = 'https://api.spotify.com/v1/audio-features'
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

async function getSongs(req){
    return new Promise(function(resolve){
        params = {time_range: 'long_term', limit: 50}
        access_token = req.query.user;
        var options = {
            url: qb('https://api.spotify.com/v1/me/top/tracks', params),
            headers: { 'Authorization': 'Bearer ' + access_token },
            json: true
        }
        request.get(options, function(error, response, body) {
            resolve(body.items);
        });
    })
   
}

function decomposeFeatures(features, name){
            let energy =  features.map(item => item.energy).reduce((prev, next) => prev + next)/features.length;
            let valence =  features.map(item => item.valence).reduce((prev, next) => prev + next)/features.length;
            let danceability =  features.map(item => item.danceability).reduce((prev, next) => prev + next)/features.length;
            let tempo =  features.map(item => item.tempo).reduce((prev, next) => prev + next)/features.length;
            let acousticness =  features.map(item => item.acousticness).reduce((prev, next) => prev + next)/features.length;
            let mode =  features.map(item => item.mode).reduce((prev, next) => prev + next)/features.length;
            return({name: name, energy: energy, valence: valence, danceability: danceability, tempo: tempo, acousticness: acousticness, mode: mode})
}


function compare(user, agents){
    agentResults = []
    agents.forEach(agent => {
        dif = 0;
        for (metric in agent){
            if (metric == "name" || metric == "tempo") continue;
            
            dif = dif + Math.abs(agent[metric] - user[metric])
        }
        agentResults.push({agent: agent.name, dif: dif})

    });
    return agentResults;
}


async function getUserInfo(req){
    return new Promise(function(resolve){
    access_token = req.query.user;
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
        };

      // use the access token to access the Spotify Web API
      request.get(options, function(error, response, body) {
          resolve(body)
      });
        });
    }



// async function getValorantPlaylist(uri, req){
//     return new Promise(function(resolve){
//         access_token = req.query.user;
//         let url = `https://api.spotify.com/v1/playlists/${uri}/tracks`
//         var options = {
//             url: url,
//             headers: { 'Authorization': 'Bearer ' + access_token },
//             json: true
//         }
//         request.get(options, function(error, response, body) {
//             resolve(body);
            
//         });
//     })
   
// }
    
