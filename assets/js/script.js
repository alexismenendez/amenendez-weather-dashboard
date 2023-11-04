var userInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var prevSearchContainer = document.querySelector(".prevSearch")
var prevSearchList = JSON.parse(localStorage.getItem("previousSearch"));
var prevSearchBtn = document.querySelectorAll(".prevSearchBtn");

///Default Page Load///

//Default City
var lat = 44.919896
var lon = -92.9339449
var apiKey = "5277a26b2d577a7efc4a79699aeb7499";

fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
    console.log(data);
    get5Day(data);
});

fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    .then(response => response.json())
    .then(data => {
    getCurrent(data)
})

///Render Last Searches///
for (i=0; i < prevSearchList.length; i++) {
    var prevSearchItem = document.createElement("button");
    prevSearchItem.textContent = prevSearchList[i];
    prevSearchItem.className = "prevSearchBtn";
    prevSearchContainer.appendChild(prevSearchItem);
}

////////////////////////////


//Search button functionality: 
//On click, get the user input, save user input to local storage, use user input to call geo API, use geo API for 5 day forcast data

searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    var userParam = userInput.value.split(", ");
    console.log(userParam);
    var cityName = userParam[0];
    var stateCode = userParam[1];
    var countryCode = userParam[2] || "";
    
    

    savePrevSearch()
    // `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=3&appid=${apiKey}&units=imperial`
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            lat = data[0].lat
            lon = data[0].lon
            console.log(lat)
            console.log(lon)
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    get5Day(data);
                });

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(response => response.json())
                .then(data => {
                    getCurrent(data)
                })
        }
    );
        
});

///////////////////////////////

///Save previous searches to local storage///

function savePrevSearch() {
    if (userInput.value.length < 1){
        return;
    } else if (prevSearchList) {
        if (!prevSearchList.includes(userInput.value)) {
            prevSearchList.push(userInput.value);
            if (prevSearchList.length > 3) {
                prevSearchList = prevSearchList.slice(-3);
            }
        localStorage.setItem("previousSearch", JSON.stringify(prevSearchList))
        };
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

////////////////////////////////

/// Render Future Weather Data ///

function get5Day(data) {

    for (i=0; i < data.list.length; i+=8) {
        //Container
        var weatherCard = document.getElementById(`weatherSlot${i}`);
        
        //Image
        var weatherCardImg = weatherCard.children[0];
        weatherCardImg.setAttribute("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`);

        //Temp
        var weatherCardTemp = weatherCard.children[1];
        // var temp = data.list[i].main.temp
        weatherCardTemp.innerHTML = `${Math.ceil(data.list[i].main.temp_max)}&deg; | ${Math.ceil(data.list[i].main.temp_min)}&deg;`

        //Date
        var weatherCardDate = weatherCard.children[2];
        var cardDate = dayjs(data.list[i].dt_txt).format("ddd")
        weatherCardDate.innerHTML = `${cardDate}`
    }
}

////////////////////////////////

/// Render Current Weather Data ///

function getCurrent(data) {
    var currentCard = document.querySelector(".selectedWeatherContainer")

    //Image
    var currentCardImg = document.querySelector(".currentIcon")
    currentCardImg.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)

    //City Name
    var currentCardCity = document.querySelector(".currentCity")
    currentCardCity.innerHTML = data.name;

    //Date
    var currentCardDate = document.querySelector(".currentDate")
    currentCardDate.innerHTML = `${dayjs(data.dt_txt).format("dddd, MMMM D")}`

    //Temp
    var currentCardTemp = document.querySelector(".currentTemp")
    currentCardTemp.innerHTML = `${Math.ceil(data.main.temp)}&deg;`

    // //"Feels like" Temp
    // var currentCardFeels = document.querySelector(".currentFeels")
    // currentCardFeels.innerHTML = `Feels like: ${data.main.feels_like}`

    // //Temp High
    // var currentCardHigh = document.querySelector(".currentHigh")
    // currentCardHigh.innerHTML = `High: ${Math.ceil(data.main.temp_max)}`

    // //Temp Low
    // var currentCardLow = document.querySelector(".currentLow")
    // currentCardLow.innerHTML = `Low: ${Math.ceil(data.main.temp_min)}`

    //Wind
    var currentCardWind = document.querySelector(".currentWind")
    currentCardWind.innerHTML = `Wind | ${Math.ceil(data.wind.speed)} mph`

    //Humidty
    var currentCardHumid = document.querySelector(".currentHumid")
    currentCardHumid.innerHTML = `Hum | ${data.main.humidity}%`
}

////////////////////////////////

//when user selects another day, it populates the main weather container


//graph that shows the highs and lows for the upcoming 5 days