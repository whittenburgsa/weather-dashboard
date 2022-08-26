var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = 'd91f911bcf2c0f925fb6535547a5ddc9'

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var searchHistoryContainer = document.querySelector('#history');
//current forecast
var todayContainer = document.querySelector('#today');
//5-day forecast
var forecastContainer = document.querySelector('#forecast');
var searchButton = document.querySelector('#search-button');
var city = document.querySelector('#city');


//search
//render
function renderSearchHistory() {
    searchHistoryContainer.innerHTML = '';

    for (let i = searchHistory.length - 1; i >= 0; i--) {
        var btn = document.createElement('button');
        btn.setAttribute('type', 'button');
        btn.setAttribute('aria-controls', 'today forecast');
        btn.classList.add('history-btn', 'btn-history');

        btn.setAttribute('data-search', searchHistory[i]);
        btn.textContent = searchHistory[i]
        searchHistoryContainer.append(btn);

    }


}

//append
function appendToHistory(search) {
    searchHistory.push(search);

    localStorage.setItem('search-history', JSON.stringify(searchHistory));
    renderSearchHistory();

}

//init
function initSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        searchHistory = JSON.parse(storedHistory);
    }

    renderSearchHistory();
}

function handleSubmit() {
    if (!city.value) {
        return
    }
    var search = city.value
    fetchCoords(search)
    city.value = ""
}

//forecast
//render
//LARGEST PART OF THE PROJECT
function renderCurrentWeather(city, weather) {
    var tempF = weather.temp;
    var windMph = weather.wind_speed;
    var humidity = weather.humidity;
    var uvi = weather.uvi;

    var card = documment.createElement('div');
    var cardBody = documment.createElement('p');
    var heading = documment.createElement('h2');
    var tempEl = documment.createElement('p');
    var windEl = documment.createElement('p');
    var humidityEl = documment.createElement('p');
    var uviEl = documment.createElement('p');
    var uviBadge = document.createElement('button');


}


function renderItems(city, data) {
    renderCurrentWeather(city, data);
    renderForecast(data);
}

function renderForecast() {

}

//fetch
// openweatherAPI
//fetch coordinates

function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    var apiUrl = `${weatherApiRootUrl}/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${weatherApiKey}`


fetch(apiUrl)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        renderItems(city, data);
    })
    .catch(function (err) {
        console.error(err);
    });
}

function fetchCoords(search) {
    var apiUrl = `${weatherApiRootUrl}/geo/1.0/direct?q=${search}&limits=5&appid=${weatherApiKey}`;

    fetch(apiUrl)
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            if (!data[0]) {
                alert('Location Not Found')

            } else {
                appendToHistory(search);
                fetchWeather(data[0]);
                console.log(data)
            }
        })
        .catch(function (err) {
            console.error(err);
        })
}

initSearchHistory();
searchButton.addEventListener("click", handleSubmit);