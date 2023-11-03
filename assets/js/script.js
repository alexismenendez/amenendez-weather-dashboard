var apiKey = "5277a26b2d577a7efc4a79699aeb7499"
var userInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var prevSearchContainer = document.querySelector(".prevSearch")
var prevSearchList = JSON.parse(localStorage.getItem("previousSearch"));
var prevSearchBtn = document.querySelectorAll(".prevSearchBtn");



//Search button functionality: 
//On click, get the user input, save user input to local storage, use user input to call geo API, use geo API for 5 day forcast data
searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    var userParam = userInput.value.split(", ");
    console.log(userParam);
    var cityName = userParam[0];
    var stateCode = userParam[1];
    var countryCode = userParam[2] || "";
    var lat
    var lon
 

    savePrevSearch()


    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            lat = data[0].lat;
            lon = data[0].lon;
        }
    );
    fetch(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => console.log(data));
});

// prevSearchBtn.addEventListener("click", function(event) {
//     event.preventDefault();

// });

//Save previous searches to local storage
function savePrevSearch() {
    if (userInput.value.length < 1){
        return;
    } else if (prevSearchList) {
        console.log('previous values', prevSearchList);
        prevSearchList.push(userInput.value);
        console.log('new values', prevSearchList);
        if (prevSearchList.length > 3) {
            prevSearchList = prevSearchList.slice(-3);
            console.log('sliced Arr', prevSearchList);
        }
        console.log('items to be set', prevSearchList)
        localStorage.setItem("previousSearch", JSON.stringify(prevSearchList));
    } else {
        prevSearchList = [];
        prevSearchList.push(userInput.value);
        localStorage.setItem("previousSearch", JSON.stringify(prevSearchList));
    };

   // clear search container
   while (prevSearchContainer.firstChild) {
        prevSearchContainer.removeChild(prevSearchContainer.firstChild);
    }

    //render previous searches
    for (i=0; i < prevSearchList.length; i++) {
        var prevSearchItem = document.createElement("button");
        prevSearchItem.textContent = prevSearchList[i];
        prevSearchItem.className = "prevSearchBtn";
        prevSearchContainer.appendChild(prevSearchItem);
    }
}

//render previous searches on page load
for (i=0; i < prevSearchList.length; i++) {
    var prevSearchItem = document.createElement("button");
    prevSearchItem.textContent = prevSearchList[i];
    prevSearchItem.className = "prevSearchBtn";
    prevSearchContainer.appendChild(prevSearchItem);
}


//fetches geo data based off city search

//code that stores a search to store to local storage and renders on screen
//code that lets user click a previous serach to search it again




// Geocoding API


// Weather API


//code pulling API data for the weather
//displays the current weather by default
//shows future weather dates to the right
//when user selects another day, it populates the main weather container
//rendering weather conditions, id pulls matching image

//night mode?

//graph that shows the highs and lows for the upcoming 5 days