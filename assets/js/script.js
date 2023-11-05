var userInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var prevSearchContainer = document.querySelector(".prevSearch")
var prevSearchList = JSON.parse(localStorage.getItem("previousSearch"));
var prevSearchBtn = document.querySelectorAll(".prevSearchBtn");

var highs = [];
var lows = [];
var dates = [];


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
if(prevSearchList) {
    for (i=0; i < prevSearchList.length; i++) {
        var prevSearchItem = document.createElement("button");
        prevSearchItem.textContent = prevSearchList[i];
        prevSearchItem.className = "prevSearchBtn";
        prevSearchItem.value = prevSearchList[i];
        prevSearchContainer.appendChild(prevSearchItem);
    
        prevSearchItem.addEventListener("click", function(event){
            event.preventDefault();
            console.log(event.target.value);
    
            var userParam = event.target.value.split(", ");
            var cityName = userParam[0];
            var stateCode = userParam[1];
            var countryCode = userParam[2] || "";
    
            savePrevSearch()
            getFetch(cityName, stateCode, countryCode);
        })
    }
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
    getFetch(cityName, stateCode, countryCode);
        
});

function getFetch(cityName, stateCode, countryCode) {
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
}

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
        prevSearchItem.value = prevSearchList[i];
        prevSearchContainer.appendChild(prevSearchItem);

        prevSearchItem.addEventListener("click", function(event){
            event.preventDefault();
            console.log(event.target.value);
    
            var userParam = event.target.value.split(", ");
            var cityName = userParam[0];
            var stateCode = userParam[1];
            var countryCode = userParam[2] || "";
    
            savePrevSearch()
            getFetch(cityName, stateCode, countryCode);
        })
    }
}

////////////////////////////////

/// Render Future Weather Data ///

function get5Day(data) {

    highs = []
    lows = []
    dates = []

    for (i=0; i < data.list.length; i+=8) {
        //Container
        var weatherCard = document.getElementById(`weatherSlot${i}`);
        
        //Image
        var weatherCardImg = weatherCard.children[0];
        $(weatherCardImg).attr("src", "").fadeOut(0);
        $(weatherCardImg).attr("src", `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`).fadeIn(1000);

        //Temp
        var weatherCardTemp = weatherCard.children[1];
        $(weatherCardTemp).html("").fadeOut(0);
        $(weatherCardTemp).html(`${Math.ceil(data.list[i].main.temp_max)}&deg; | ${Math.floor(data.list[i].main.temp_min)}&deg;`).fadeIn(1000);

        //Date
        var weatherCardDate = weatherCard.children[2];
        var cardDate = dayjs(data.list[i].dt_txt).format("ddd");
       $(weatherCardDate).html("").fadeOut(0);
       $(weatherCardDate).html(`${cardDate}`).fadeIn(1000);

       var highsRetrieve = (Math.ceil(data.list[i].main.temp_max))
       highs.push(highsRetrieve)

       var lowsRetrieve = (Math.floor(data.list[i].main.temp_min))
       lows.push(lowsRetrieve)

       var datesRetrieve = dayjs(data.list[i].dt_txt).format("MM/DD");
       dates.push(datesRetrieve)

    }

    console.log("highs: ", highs)
    console.log("lows: ", lows)
    console.log("dates: ", dates)
    getHiLowChart(highs, lows, dates)
}

////////////////////////////////

/// Render Current Weather Data ///

function getCurrent(data) {
    //Image
    var currentCardImg = document.querySelector(".currentIcon");
    $(currentCardImg).attr("src", "").fadeOut(0);
    $(currentCardImg).attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`).fadeIn(1000);

    //City Name
    var currentCardCity = document.querySelector(".currentCity");
    $(currentCardCity).html("").fadeOut(0);
    $(currentCardCity).html(data.name).fadeIn(1000);

    //Date
    var currentCardDate = document.querySelector(".currentDate");
    $(currentCardDate).html("").fadeOut(0);
    $(currentCardDate).html(`${dayjs(data.dt_txt).format("dddd, MMMM D")}`).fadeIn(1000);

    //Temp
    var currentCardTemp = document.querySelector(".currentTemp");
    $(currentCardTemp).html("").fadeOut(0);
    $(currentCardTemp).html(`${Math.ceil(data.main.temp)}&deg;`).fadeIn(1000);

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
    var currentCardWind = document.querySelector(".currentWind");
    $(currentCardWind).html("").fadeOut(0);
    $(currentCardWind).html(`Wind | ${Math.ceil(data.wind.speed)} mph`).fadeIn(1000);

    //Humidty
    var currentCardHumid = document.querySelector(".currentHumid");
    $(currentCardHumid).html("").fadeOut(0);
    $(currentCardHumid).html(`Hum | ${data.main.humidity}%`).fadeIn(1000);
}

function getHiLowChart(highs, lows, dates) {

    new Chart("highLowChart", {
        type: "line",
        data: {
            labels: dates,
            datasets: [{
                data: highs,
                borderColor: "#FFECCF",
                backgroundColor: "#ebeff8",
                fill: false
            }, {
                data: lows,
                borderColor: "#fff7eb84",
                backgroundColor: "#ebeff8",
                fill: false
            }]
        },
        options: {
            legend: {display: false},
        }
    });

}

////////////////////////////////