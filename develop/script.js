var apiKey = "49cc6a006585fb3ce4820b7dc7dcd4e5"
var cities = []
var searchedCity;

var citySearch = document.querySelector("#city-input")
var searchForm = document.querySelector(".form-inline")
var searchHistory = document.querySelector(".search-history")
var todayForecast = document.querySelector(".today-forecast")
var fiveDayForecast = document.querySelector(".forecast") // Come back to this variable later //

let today = moment().format("MM/DD/YYYY")

// API Fetch

var searchQuery = function(city){
    var apiURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey
    searchedCity = city

    fetch(apiURL)
    .then(function(response){
        if (response.ok) {
            response.json().then(function(data){
                var cityLat = data.city.coord.lat
                var cityLon = data.city.coord.lon
                return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" 
                + cityLat + "&lon=" + cityLon + "&units=imperial" + "&appid=" + apiKey)
                .then(function(response2){
                    response2.json().then(function(data){
                        getTodayForecast(data)
                    })
                })
                getTodayForecast(data)
            })
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error){
        alert("Network Connection Error");
    })
}

// Saving Search History to Local Storage

function storedHistory(){
    storedHistory.innerHTML = ""
    localStorage.setItem("cities", JSON.stringify(cities));
    loadCities();
}

var formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event)
    var cityName = citySearch.value.trim()

    if (cityName){
        searchQuery(cityName)
        citySearch.value = "";
        cities.push(cityName)
        addSearchedCity(cityName)
        storedHistory()
    } else {
        alert("Please enter a valid city name within the United States of America.")
    }
}

// Today's forecast

var getTodayForecast = function(city){
    console.log(city)
    console.log(city.current.dt)
    console.log(searchedCity)

// Clear content

    todayForecast.innerHTML = ""

// Weather Icons

    var weatherIcon = city.current.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"

// Define variable for forecast cards

    var temp = city.current.temp + "F"
    var humidity = city.current.humidity
    var windSpeed = city.current.wind_speed

// Content for current forecast

    var todayDivEl = document.createElement("div")
    todayDivEl.classList = "row mb-3"

    var todayHeaderEl = document.createElement("h2")
    todayHeaderEl.classList = "card-title"
    todayHeaderEl.innerHTML = "(" + today + ") <img src='" + iconUrl + "'>"

// City Name

    var cityNameEl = document.createElement("h2")
    cityNameEl.textContent = searchedCity.toUpperCase()

    var todayTempEl = document.createElement("p")
    todayTempEl.classList = "card-text"
    todayTempEl.textContent = "Temperature: " + temp

    var todayHumidityEl = document.createElement("p")
    todayHumidityEl.classList = "card-text"
    todayHumidityEl.textContent = "Humidity: " + humidity

    var todayWindSpeedEl = document.createElement("p")
    todayWindSpeedEl.classList = "card-text"
    todayWindSpeedEl.textContent = "Wind Speed: " + windSpeed
    
    todayHumidityEl.appendChild(todayWindSpeedEl)
    todayTempEl.appendChild(todayHumidityEl)
    todayHeaderEl.appendChild(todayTempEl)
    todayDivEl.appendChild(todayHeaderEl)
    todayForecast.appendChild(todayDivEl)

    getUvi(city)
}

// Coordinating UVI with matching background color

var getUvi = function(city){
    var uvi = city.current.uvi
    
    var uviEl = document.createElement("span")
    uviEl.setAttribute = ("style", "bold")
    uviEl.innerHTML = "<h4>UV Index: " + uvi + "</h4>"

    if (uvi < 3 ) {
        uviEl.classList = ("badge badge-success")
    } else if (uvi < 7 ) {
        uviEl.classList = ("badge badge-warning")
    } else if (uvi > 8 ){
        uviEl.classList = ("badge badge-danger")
    }
    todayForecast.appendChild(uviEl)
    getFiveDay(city)
}

var getFiveDay = function(city){
    fiveDayForecast.innerHTML = ""

    for (var i = 0; i < city.daily.length; i++){
        var weatherIcon = city.daily[i].weather[0].icon
        var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png"

        var fiveDayContainer = document.createElement("div")
        fiveDayContainer.classList = ("card text-white mb-3 m-4")

        var fiveDayHeaderDiv = document.createElement("div")
        fiveDayHeaderDiv.classList = ("card-header")
        fiveDayHeaderDiv.innerHTML = moment().add(i, "days").format("MM/DD/YYYY") + "<img src = '" + iconUrl + "'>"

        var textDiv = document.createElement("div")
        textDiv.classList = ("card-body")

        var tempEl = document.createElement("p")
        tempEl.classList = "card-text"
        tempEl.textContent = "Temperature: " + city.daily[i].temp.day + "F"

        var humidityEl = document.createElement("p")
        humidityEl.classList = "card-text"
        humidityEl.textContent = "Humidity: " + city.daily[i].humidity

        tempEl.appendChild(humidityEl)
        textDiv.appendChild(tempEl)
        fiveDayHeaderDiv.appendChild(textDiv)
        fiveDayContainer.appendChild(fiveDayHeaderDiv)
        fiveDayForecast.appendChild(fiveDayContainer)
    }
}

var addSearchedCity = function(cityName){
    var buttonEl = document.createElement("btn")
    buttonEl.setAttribute("type", "button")
    buttonEl.setAttribute("data-city", cityName)
    buttonEl.classList = "btn btn-secondary"
    buttonEl.textContent = cityName.toUpperCase()

    searchHistory.appendChild(buttonEl)
}

var loadCities = function(){
    searchHistory.innerHTML = ""
    var cityArray = JSON.parse(localStorage.getItem("cities"));
    console.log(typeof cityArray);

    for (var i = 0; i < cityArray.length; i++) {
        addSearchedCity(cityArray[i])
    }
}

storedHistory ()

searchHistory.addEventListener("click", function(event){
    var searchHistoryBtn = event.target.attributes.getNamedItem("data-city").value

    searchQuery(searchHistoryBtn)
})

searchForm.addEventListener("submit", formSubmitHandler)

