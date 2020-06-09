'use strict';

const apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php';

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
    finalHTML += `</li>`;

    resultContainer.html(finalHTML);
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