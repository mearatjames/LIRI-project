require("dotenv").config()
let request = require('request')
let Spotify = require('node-spotify-api')
let moment = require('moment')
let key = require('./key')
let fs = require('fs')

switch (process.argv[2]) {
    case 'concert-this':
        let artist = process.argv.slice(3).join('')
        concert(artist)
        break;
    case 'spotify-this-song':
        let song = process.argv.slice(3).join(' ')
        spotifySong(song)
        break;
    case 'movie-this':
        let movie = process.argv.slice(3).join('')
        omdb(movie)
        break;
    case 'do-what-it-says':
        fs.readFile('random.txt', 'utf8', function(e, data) {
            if (e) {
                console.log(e)
            } else {
                console.log(data)
                let cmdArr = data.split(',')
                switch (cmdArr[0]) {
                   case 'spotify-this-song':
                    spotifySong(cmdArr[1])
                    break;
                   case 'movie-this':
                    omdb(cmdArr[1])
                    break;
                   case 'concert-this':
                    concert(cmdArr[1])
                    break;
                }
            }
        })
        break;
}

function spotifySong(song) {
    if (song == "") {
        song = 'The Sign'
    }
    let spotify = new Spotify({
        id: key.spotify.id,
        secret: key.spotify.secret
    })
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } 
        for (let i = 0; i < 10; i++) {
            console.log('Artist: ' + data.tracks.items[i].artists[0].name)
            console.log('Song Name: ' + data.tracks.items[i].name)
            console.log('External Link: ' + data.tracks.items[i].external_urls.spotify)
            console.log('Album Name: ' + data.tracks.items[i].album.name)
            console.log("============================")
        }
    })
}

function concert(artist) {
    if (artist == "") {
        artist = "Maroon 5"
    }
    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
            if (!error && response.statusCode === 200) {
            let concert = JSON.parse(body)
            console.log(concert[0].lineup[0])
            concert.forEach(element => {
                console.log(`
Venue: ${element.venue.name}
City: ${element.venue.city}
Date: ${moment(element.datetime).format('MM/DD/YYYY')}
====================`)
            })  
            }
        })
}

function omdb(movie) {
    if (movie == "") {
        movie = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?apikey=8fbf74c9&t=" + movie, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                let result = JSON.parse(body)
            console.log(result)
            console.log('Title: ' + result.Title)
            console.log('Year: ' + result.Year)
            console.log('IMDB Rating: ' + result.imdbRating)
            console.log('Rotten Tomatoes Rating: ' + result.Ratings[1].Value)
            console.log('Country: ' + result.Country)
            console.log('Language: ' + result.Language)
            console.log('Plot: ' + result.Plot)
            console.log('Actors: ' + result.Actors)
            }
    })
}