'use strict';

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=0; var c1 = 0; var c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

const STORE = {
  apiURL : 'https://www.thecocktaildb.com/api/json/v1/1/search.php',
  ingSearch : "https://www.thecocktaildb.com/api/json/v1/1/filter.php",
  randomAlcURL : "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic",
  randomNonURL : "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic",
  fullCocktail : "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=",
  youtubeAPIsearch : 'https://www.googleapis.com/youtube/v3/search',
  myEncodedTube : 'QUl6YVN5RGlVLTJsTDVtaHU2STVacXdBbzI2X2h2Zi0zcTdWTzVZ'
};

let drinkArray = null;
let showingDrink = false;

function getCocktail(searchWord) {
  let endpointURL = "";
  if ($('#byName').is(':checked')) {
    endpointURL = STORE.apiURL+"?s="+searchWord;
  } else {
    endpointURL = STORE.ingSearch+"?i="+searchWord;
  }
  fetch(endpointURL)
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error("Couldn't return JSON");
    })
    .then(responseText => {
      if (responseText.length) { 
        return JSON.parse(responseText)
      } else {
        return {};
      }
    })
    .then(responseJson => {
        if (responseJson.drinks == null){
            throw new Error("No drinks found!");
        }
        displayResults(responseJson.drinks);
    })
    .catch(error => {
        showError(error.message);
    }); 
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
  }
  
function getYouTubeVideos(query, maxResults=10) {
    const params = {
      key: Base64.decode(STORE.myEncodedTube),
      q: query,
      part: 'snippet',
      maxResults
    };
    const queryString = formatQueryParams(params)
    const url = STORE.youtubeAPIsearch + '?' + queryString;
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayYoutubeVideos(responseJson))
      .catch(err => {
        showError(`Something went wrong: ${err.message}`);
      });
}

function displayYoutubeVideos(videolist){
    let ytContainer = $('#youtubeResult').html("<h2>Here are some related recipe videos!</h2>");
    ytContainer.append("<div id='ytResults'></div>");
    let results = $('#ytResults');
    for (let i = 0; i < videolist.items.length; i++){
        let video = videolist.items[i];
        let vidId = video.id.videoId;
        let vidURL = "https://www.youtube.com/watch?v="+vidId;
        let vidTitle = video.snippet.title;
        let vidThumb = video.snippet.thumbnails.medium.url;
        results.append(`<div class="ytResultItems"><a href="${vidURL}" target="_blank"><img src="${vidThumb}" alt="${vidTitle}"/><br><span class="vidtitle">${vidTitle}</span></a></div>`);
    }
}

function scrollTo(elementID) {
  var target = $('#'+elementID);
  if (target.length) {
    $('html, body').stop().animate(
    {
      scrollTop: target.offset().top,
    }, 1000);
  }
}

function displayResults(list){
    drinkArray = list;
    showingDrink = false;

    let results = $('#resultslist').empty();
    for (let i = 0; i < list.length; i++){
        results.append(`<li id="${i}" class="multiDrinkResult"><img class="resultImage" src="${list[i].strDrinkThumb}" alt="${list[i].strDrink}"/><br><span class="drinkResultsName">${list[i].strDrink}</span></li>`);
    }
    scrollTo('resultsDisplay');
}

function onCocktailClick(){
    $('#resultslist').on("click", ".resultImage", function(event){
        if(showingDrink) { return; }
        let resultContainer = $('#resultslist').empty();
        let drinkArrayID = $(this).parent().attr('id');
        if ($('#byName').is(':checked')) {
          displayCocktail(drinkArrayID);
        } else if ($('#byIngredient').is(':checked')){
          displayByIng(drinkArrayID);
        }  
    });
}

function displayCocktail(drinkArrayID){
  let drink = drinkArray[drinkArrayID];
  showingDrink = true;

  renderDrinkPage(drink);

  scrollTo('resultsDisplay');
}

function displayByIng(drinkArrayID) {
  let drinkID = drinkArray[drinkArrayID].idDrink;
  showingDrink = true;

  fetch(STORE.fullCocktail+drinkID)
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error("Couldn't return JSON");
    })
    .then(responseText => {
      if (responseText.length) { 
        return JSON.parse(responseText)
      } else {
        return {};
      }
    })
    .then(responseJson => {
        if (responseJson.drinks == null){
            throw new Error("No drinks found!");
        }
        let drink = responseJson.drinks[0];
        renderDrinkPage(drink);
        
    })
    .catch(error => {
        showError(error.message);
    });
  scrollTo('resultsDisplay'); 
}


function renderDrinkPage(drink) {
  let resultContainer = $("#resultslist");
  let finalHTML = "";

  finalHTML += `<li class="individualDrink">`;
  finalHTML += `<div class="resultsContainer">`;
  finalHTML += `<div id="cocktailInfo">`;
  finalHTML += `<div id="resultLeft">`;
  finalHTML += `Cocktail name: ${drink.strDrink}<br><br>`;

  finalHTML += `Ingredients:<br>`;

  for(let i = 1; i <= 15; i++) {
    if(drink['strIngredient'+i] == null) { break; }
    if (drink['strMeasure'+i] !== null) {
      finalHTML += `${drink['strMeasure'+i]}`;
    } 
    finalHTML += `${drink['strIngredient'+i]}<br>`;
  }

  finalHTML += `<p class="recipe">Recipe: ${drink.strInstructions}</p>`;
  finalHTML += `</div>`;
  finalHTML += `<img class="resultImage" src='${drink.strDrinkThumb}' alt="${drink.strDrink}"/>`;
  finalHTML += `</div>`;
  finalHTML += `<div id="youtubeResult"></div>`;
  finalHTML += `</div>`;
  finalHTML += `</li>`;
  resultContainer.html(finalHTML);

  getYouTubeVideos(drink.strDrink+" drink recipe", 5);
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomAlc() {
  $('#randomAlc').on('click', function(event){
    event.preventDefault();
    errorReset();
    getRandomDrink("alcoholic");
  });
}

function getRandomNon() {
  $('#randomNon').on('click', function(event){
    event.preventDefault();
    errorReset();
    getRandomDrink("nonAlcoholic");
  });
}

function getRandomDrink(drinkType) {
  let endpointURL = "";
  if (drinkType == "alcoholic") {
    endpointURL = STORE.randomAlcURL;
  } else {
    endpointURL = STORE.randomNonURL;
  }
  fetch(endpointURL)
    .then(response => {
      if (response.ok) {
        return response.text();
      }
      throw new Error("Couldn't return JSON");
    })
    .then(responseText => {
      if (responseText.length) { 
        return JSON.parse(responseText)
      } else {
        return {};
      }
    })
    .then(responseJson => {
        if (responseJson.drinks == null){
            throw new Error("No drinks found!");
        }
        drinkArray = responseJson.drinks;
        let random = getRndInteger(0,drinkArray.length - 1);
        displayByIng(random);
    })
    .catch(error => {
        showError(error.message);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    errorReset();
    let searchWord = $('#searchWord').val();      
    getCocktail(searchWord);
  });
}

function showError(err) {
  $("#errormsg").html(err);
}

function errorReset() {
  $("#errormsg").html("");
}
 
function initializePage() {
  watchForm();
  onCocktailClick();
  getRandomAlc();
  getRandomNon();
}

$(initializePage);
