'use strict';

const apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';
const ingSearch = "https://www.thecocktaildb.com/api/json/v1/1/filter.php";
const randomAlcURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
const randomNonURL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
const fullCocktail = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";
const youtubeAPIsearch = 'https://www.googleapis.com/youtube/v3/search';
const ytKey = 'AIzaSyCw0ku4U1cMqdpqwFaYYSH9q2mJSPwlQWo';

let drinkArray = null;
let showingDrink = false;

function getCocktail(searchWord) {
  let endpointURL = "";
  if ($('#byName').is(':checked')) {
    endpointURL = apiURL+"?s="+searchWord;
  } else {
    endpointURL = ingSearch+"?i="+searchWord;
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
            throw new Error("no drinks found");
        }
        displayResults(responseJson.drinks);
    })
    .catch(error => {
        console.log(error);
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


// used when requests to YT API max out
function getYoutubeVideosTEMPORARY() {
  const tempString = `{"kind":"youtube#searchListResponse","etag":"0JMdRU2K-nTWZJrD3z8y-W_CZD4","nextPageToken":"CAkQAA","regionCode":"US","pageInfo":{"totalResults":844142,"resultsPerPage":9},"items":[{"kind":"youtube#searchResult","etag":"oEJwV4VPJJjYUmKBzUYp6S45WOE","id":{"kind":"youtube#video","videoId":"XV0ovFOgFNM"},"snippet":{"publishedAt":"2019-02-01T03:50:04Z","channelId":"UCkn1_Lun4fUm2TghAdcw3BQ","title":"Non-Alcoholic Lemon Drop Shots Recipe - TastedRecipes","description":"NonAlcoholicDrinks #lemondropshots #Partybeverages #GirlsNightBeverages Lemon Drop Shots is a very mischievous drink. Super tangy drink without alcohol ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/XV0ovFOgFNM/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/XV0ovFOgFNM/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/XV0ovFOgFNM/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Tasted Recipes","liveBroadcastContent":"none","publishTime":"2019-02-01T03:50:04Z"}},{"kind":"youtube#searchResult","etag":"Al-iX-alnR4uuLgs8nyhvruFT7w","id":{"kind":"youtube#video","videoId":"pjq0oKn60ck"},"snippet":{"publishedAt":"2014-05-26T14:00:03Z","channelId":"UCClfkO4dGGprxPHAgE67Gsg","title":"Lemon Drop Shot - How to make a Lemon Drop Shot Recipe by Drink Lab (Popular)","description":"How to make a Lemon Drop Shot For full Shot Recipe details visit: http://www.drinklab.org/lemon-drop-shot/ Ingredients to make a Lemon Drop Shot 3/4 Shot ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/pjq0oKn60ck/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/pjq0oKn60ck/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/pjq0oKn60ck/hqdefault.jpg","width":480,"height":360}},"channelTitle":"DrinkLab Cocktail Recipes","liveBroadcastContent":"none","publishTime":"2014-05-26T14:00:03Z"}},{"kind":"youtube#searchResult","etag":"-lBASxNlSl8Roh25R273lPZzW58","id":{"kind":"youtube#video","videoId":"4w4I8VfrUDU"},"snippet":{"publishedAt":"2015-01-14T09:35:33Z","channelId":"UCxvCREZNXKWvcpKjvIjEF0Q","title":"How to Make The Lemon Drop Shot - Best Drink Recipes","description":"The lemon drop... but this time... a shot!","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/4w4I8VfrUDU/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/4w4I8VfrUDU/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/4w4I8VfrUDU/hqdefault.jpg","width":480,"height":360}},"channelTitle":"bestdrinkrecipes","liveBroadcastContent":"none","publishTime":"2015-01-14T09:35:33Z"}},{"kind":"youtube#searchResult","etag":"6vcdO5GidzBxDVqfGQAKwH6VZ_8","id":{"kind":"youtube#video","videoId":"VrXFYbwn1Sg"},"snippet":{"publishedAt":"2019-03-04T09:38:57Z","channelId":"UCluJQv2dM2DET6Yo0-XNbFQ","title":"Lemon Drop Shots Cocktail | How to make this recipe at Home | Vodka Cocktails","description":"Lemon Drop Shot is easy to make party drink. Lemon Drop Cocktail is a sweet and Sour drink. Ingredients 1. vodka (chilled) 2. Lime Juice 3. lemon wedge 4.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/VrXFYbwn1Sg/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/VrXFYbwn1Sg/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/VrXFYbwn1Sg/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Kudi Magan Cocktails","liveBroadcastContent":"none","publishTime":"2019-03-04T09:38:57Z"}},{"kind":"youtube#searchResult","etag":"QJ5PrMX0VBxNZqhtqBAvsYEpQzM","id":{"kind":"youtube#video","videoId":"IUFQN54mAfw"},"snippet":{"publishedAt":"2019-04-25T15:12:05Z","channelId":"UCTvYEid8tmg0jqGPDkehc_Q","title":"How to Make a Lemon Drop Cocktail","description":"You'll love treating yourself to this citrusy lemon drop cocktail; it goes down smooth but it packs quite a punch so sip with care! Make sure to use fresh lemon ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/IUFQN54mAfw/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/IUFQN54mAfw/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/IUFQN54mAfw/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Preppy Kitchen","liveBroadcastContent":"none","publishTime":"2019-04-25T15:12:05Z"}},{"kind":"youtube#searchResult","etag":"LaSITWMu_CGhON8XhsMIHt_TK8w","id":{"kind":"youtube#video","videoId":"ZHg8LVazIro"},"snippet":{"publishedAt":"2007-08-17T20:30:58Z","channelId":"UClp7vBD8JkJRRPBIdXPnDfA","title":"Lemon Drop Shooter Cocktail Drink Recipe","description":"More cocktail drink recipes and videos at http://barbook.com/drink-recipes.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/ZHg8LVazIro/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/ZHg8LVazIro/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/ZHg8LVazIro/hqdefault.jpg","width":480,"height":360}},"channelTitle":"American Bartending School","liveBroadcastContent":"none","publishTime":"2007-08-17T20:30:58Z"}},{"kind":"youtube#searchResult","etag":"zMTdvwPdZxl-OzkyaXqpgMcpBZU","id":{"kind":"youtube#video","videoId":"x3s6Gre3LpE"},"snippet":{"publishedAt":"2011-11-23T18:36:19Z","channelId":"UCaDY8WjYWy36bnt0RVzSklw","title":"How to make the Lemon Drop Shot - Tipsy Bartender","description":"A sugar rimmed...LEMON DROP! This shot is fun, tasty, and girls love it! It's a cute little shot that is always a hit for those who prefer sweeter tasting drinks.","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/x3s6Gre3LpE/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/x3s6Gre3LpE/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/x3s6Gre3LpE/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Tipsy Bartender","liveBroadcastContent":"none","publishTime":"2011-11-23T18:36:19Z"}},{"kind":"youtube#searchResult","etag":"Q_EKRWsS000Xk93E0lrN6QqyVa0","id":{"kind":"youtube#video","videoId":"v2zXxadipvY"},"snippet":{"publishedAt":"2017-06-05T06:30:04Z","channelId":"UCj8dMfuPyVoMG6nHhKl7jow","title":"LEMON GINGER SHOT RECIPE - IMMUNE SYSTEM BOOST (WITHOUT JUICER)","description":"Today were making one of the healthiest drinks in the world, the lemon ginger shot. Not only does it provide an immune system boost it also has a number of ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/v2zXxadipvY/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/v2zXxadipvY/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/v2zXxadipvY/hqdefault.jpg","width":480,"height":360}},"channelTitle":"KETOHYPE","liveBroadcastContent":"none","publishTime":"2017-06-05T06:30:04Z"}},{"kind":"youtube#searchResult","etag":"a_T2cwjr9oX60ixN02X1SyCcIZk","id":{"kind":"youtube#video","videoId":"l-v_OInoKzA"},"snippet":{"publishedAt":"2018-01-01T16:43:26Z","channelId":"UCPe3XrlvcEi7jNqL20xKYwg","title":"Ginger and Lemon Wellness Shots neeno’s essentials","description":"Ingredients - 3 lemons - Handsized amount of Ginger - Cayenne pepper - Oil of oregano - Cloves of garlic optional Directions W/ Juicer 1. Remove skin from ...","thumbnails":{"default":{"url":"https://i.ytimg.com/vi/l-v_OInoKzA/default.jpg","width":120,"height":90},"medium":{"url":"https://i.ytimg.com/vi/l-v_OInoKzA/mqdefault.jpg","width":320,"height":180},"high":{"url":"https://i.ytimg.com/vi/l-v_OInoKzA/hqdefault.jpg","width":480,"height":360}},"channelTitle":"Neen Williams","liveBroadcastContent":"none","publishTime":"2018-01-01T16:43:26Z"}}]}`;
  const tempParsed = JSON.parse(tempString);
  displayYoutubeVideos(tempParsed);
}

function displayYoutubeVideos(videolist){
    //console.log(JSON.stringify(videolist));
    //console.log(videolist);
    let ytContainer = $('#youtubeResult').html("<h2>Here are some related recipe videos!</h2>");
    ytContainer.append("<div id='ytResults'></div>");
    let results = $('#ytResults');
    for (let i = 0; i < videolist.items.length; i++){
        let video = videolist.items[i];
        let vidId = video.id.videoId;
        let vidURL = "https://www.youtube.com/watch?v="+vidId;
        let vidTitle = video.snippet.title;
        let vidThumb = video.snippet.thumbnails.medium.url;
        results.append(`<div class="ytResultItems"><a href="${vidURL}" target="_blank"><img src="${vidThumb}" /><br><span class="vidtitle">${vidTitle}</span></a></div>`);
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
    console.log(list);

    drinkArray = list;
    showingDrink = false;

    let results = $('#resultslist').empty();
    for (let i = 0; i < list.length; i++){
        results.append(`<li id="${i}" class="multiDrinkResult"><img class="resultImage" src="${list[i].strDrinkThumb}" /><br><span class="drinkResultsName">${list[i].strDrink}</span></li>`);
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

  fetch(fullCocktail+drinkID)
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
            throw new Error("no drinks found");
        }
        let drink = responseJson.drinks[0];
        renderDrinkPage(drink);
        
    })
    .catch(error => {
        console.log(error);
        alert(error.message);
    });
  scrollTo('resultsDisplay'); 
}


function renderDrinkPage(drink) {
  let resultContainer = $("#resultslist");
  let finalHTML = "";

  finalHTML += `<li class="individualDrink">`;
  finalHTML += `<div class="resultsContainer">`;
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

  finalHTML += `<img class="resultImage" src='${drink.strDrinkThumb}' />`;
  finalHTML += `</div>`;
  finalHTML += `<div id="youtubeResult"></div>`;
  finalHTML += `</div>`;
  finalHTML += `</li>`;
  resultContainer.html(finalHTML);

  getYouTubeVideos(drink.strDrink+" drink recipe", 5);
  //getYoutubeVideosTEMPORARY();
}


function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomAlc() {
  $('#randomAlc').on('click', function(event){
    event.preventDefault();
    getRandomDrink("alcoholic");
  });
}

function getRandomNon() {
  $('#randomNon').on('click', function(event){
    event.preventDefault();
    getRandomDrink("nonAlcoholic");
  });
}

function getRandomDrink(drinkType) {
  let endpointURL = "";
  if (drinkType == "alcoholic") {
    endpointURL = randomAlcURL;
  } else {
    endpointURL = randomNonURL;
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
            throw new Error("no drinks found");
        }
        drinkArray = responseJson.drinks;
        let random = getRndInteger(0,drinkArray.length - 1);
        displayByIng(random);
    })
    .catch(error => {
        console.log(error);
        alert(error.message);
    });
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
$(getRandomAlc);
$(getRandomNon);