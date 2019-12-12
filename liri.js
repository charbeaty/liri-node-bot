
//Set up node require modules & global variables 
require('dotenv').config();
var axios = require('axios');
var moment = require('moment');
var keys = require('./keys.js');
var fs = require('fs');

//Set API keys to variables
var Spotify = require('node-spotify-api');
var bitKey = keys.bandsInTown.key;
var omdb = keys.omdb.key;

//New Spotify variable to pass secrets to Spotify API
//Returns a valid API key
var spotify = new Spotify(keys.spotify);

//Take in command line arguments
function userInput() {
    var searchType = process.argv[2]
    var searchTerm = process.argv.slice(3).join('');
    whichSearch(searchType, searchTerm);
}

//Switch function to determine which API to search
function whichSearch(searchType, searchTerm) {
    switch (searchType) {
        case 'concert-this': {
            searchBIT(searchTerm);
        }
            break;
        case 'spotify-this-song': {
            searchSpotify(searchTerm);
        }
            break;
        case 'movie-this': {
            searchOMDB(searchTerm);
        }
            break;
        case 'do-what-it-says': {
            searchRandom(searchTerm);
        }
            break;
        default: {
            console.log('Please make a valid request');
        }
    }
}

//Functions for individual API searches

//Bands in Town Search
function searchBIT(searchTerm) {
    axios.get("https://rest.bandsintown.com/artists/" + searchTerm + "/events?app_id=" + bitKey)

        .then(function(response) {
            response = response.data;

            for (var i = 0; i < response.length; i++) {
                console.log('\nVenue: ' + response[i].venue.name);
                console.log('\nLocation: ' + response[i].venue.city);
                
                var dateFormat = moment(response[i].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY');
                console.log('\nDate: ' + dateFormat);

                console.log('\n++++++++++++++++++++++++++++++++');
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}
//Spotify Search
function searchSpotify(searchTerm) {
    spotify.search({
        type: 'track',
        query: searchTerm
    }, function(err, data) {
        if (err) {
            return console.log(err);
        }
        var response = data.tracks.items[0];
            for (let i = 0; i < response.artists.length; i++) {
                var respArtist = response.artists[i].name;
            }
            console.log('Name: ' + response.name);
            console.log('Preview: ' + response.preview_url);
            console.log('Album: ' + response.album.name);
            console.log('Artists: ' + respArtist);
    });
}

//OMDB Search
function searchOMDB(searchTerm) {
    axios.get('http://www.omdbapi.com/?apikey=' + omdb + '&t=' + searchTerm)

        .then(function (response) {
            response = response.data;
            console.log('Title: ' + response.Title);
            console.log('Release Year: ' + response.Year);
            console.log('IMDB Rating: ' + response.Ratings[0].Value);
            console.log('Rotten Tomatoes Rating:' + response.Ratings[1].Value);
            console.log('Filmed in: ' + response.Country);
            console.log('Language: ' + response.Language);
            console.log('Plot: ' + response.Plot);
            console.log('Cast: ' + response.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
}
//Random.txt Search
function searchRandom(searchTerm) {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(',');
        let searchType = dataArr[0];
        let searchTerm = dataArr[1];
        
        whichSearch(searchType, searchTerm);
    })
}

userInput();