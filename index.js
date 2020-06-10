'use strict';

const apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';
const youtubeAPIsearch = 'https://www.googleapis.com/youtube/v3/search';
const ytKey = 'AIzaSyAXSv3KoPLyY1dK6iKqtWF8xzGxnGhPhJQ';

let drinkArray = null;

function getCocktail(searchWord) {
    fetch(apiURL+"?s="+searchWord)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Couldn't return JSON");
    })
    .then(responseJson => {
        if (responseJson.drinks == null){
            throw new Error("no drinks found");
        }
        displayResults(responseJson.drinks);
    })
    .catch(error => {
        alert(error.message);
    }); 
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }
  
function getYouTubeVideos(query, maxResults=10) {
    const params = {
      key: ytKey,
      q: query,
      part: 'snippet',
      maxResults
    };
    const queryString = formatQueryParams(params)
    const url = youtubeAPIsearch + '?' + queryString;
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayYoutubeVideos(responseJson))
      .catch(err => {
        alert(`Something went wrong: ${err.message}`);
        });
}

function displayYoutubeVideos(videolist){
    console.log(videolist);
    let ytContainer = $('#youtubeResult').html("<h2>Here are some related recipe videos!</h2>");
    ytContainer.append("<div id='ytResults'></div>");
    let results = $('#ytResults');
    for (let i = 0; i < videolist.items.length; i++){
        let video = videolist.items[i];
        let vidId = video.id.videoId;
        let vidURL = "https://www.youtube.com/watch?v="+vidId;
        let vidTitle = video.snippet.title;
        let vidThumb = video.snippet.thumbnails.medium.url;
        results.append(`<div><a href="${vidURL}" target="_blank">${vidTitle}<br><img src="${vidThumb}" /></a></div>`);
    }
}

function displayResults(list){
    console.log(list);

    drinkArray = list;

    let results = $('#resultslist').empty();
    for (let i = 0; i < list.length; i++){
        results.append(`<li id="${i}">${list[i].strDrink}<br><img class="resultImage" src="${list[i].strDrinkThumb}" /></li>`);
    }
}

function onCocktailClick(){
    $('#resultslist').on("click", ".resultImage", function(event){
        let resultContainer = $('#resultslist').empty();
        let drinkID = $(this).parent().attr('id');
        displayCocktail(drinkID);
    });
}

function displayCocktail(drinkID){
    let resultContainer = $("#resultslist");
    let drink = drinkArray[drinkID];

    let finalHTML = "";

    finalHTML += `<li>`;
    finalHTML += `Cocktail name: ${drink.strDrink}<br><br>`;

    finalHTML += `Ingredients:<br>`;

    for(let i = 1; i <= 15; i++) {
        if(drink['strIngredient'+i] == null) { break; }

        finalHTML += `${drink['strIngredient'+i]}<br>`;
    }

    finalHTML += `<p>Recipe: ${drink.strInstructions}</p>`;

    finalHTML += `<img class="resultImage" src='${drink.strDrinkThumb}' />`;
    finalHTML += `<div id="youtubeResult"></div>`;
    finalHTML += `</li>`;

    resultContainer.html(finalHTML);
    getYouTubeVideos(drink.strDrink+" drink recipe", 9);
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      let searchWord = $('#searchWord').val();      
      getCocktail(searchWord);
    });
  }
  
$(watchForm);
$(onCocktailClick);