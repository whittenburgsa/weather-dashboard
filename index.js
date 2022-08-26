var searchHistory = [];
var weatherApiRootUrl = 'https://api.openweathermap.org';
var weatherApiKey = '7ab439372a6b7834b1058543aced3bee'

var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#search-input');
var searchHistoryContainer = document.querySelector('#history');
//current forecast
var todayContainer = document.querySelector('#today');
//5-day forecast
var forecastContainer = document.querySelector('#forecast');
var searchButton = document.querySelector('#search-button');
var city = document.querySelector('#city');
var currentWeather = document.getElementById('current-weather');
var forecastContainer = document.getElementById('forecast');



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
    console.log(weather)
    var date = moment().format("M/D/YYYY")
    var tempF = weather.current.temp;
    var windMph = weather.current.wind_speed;
    var humidity = weather.current.humidity;
    var uvi = weather.current.uvi;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
    var uviEl = document.createElement('p');
    var uviBadge = document.createElement('button');
    var iconUrl = `https://openweathermap.org/img/w/${weather.current.weather[0].icon}.png`;
    var iconAlt = weather.current.weather[0].description;
    var weatherIcon = document.createElement('img');

    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconAlt);
    tempEl.textContent = `${Math.round(tempF)} F`;
    windEl.textContent = `${Math.round(windMph)} MPH`;
    humidityEl.textContent = `${humidity} %`;
    uviEl.textContent = "uvindex: ";
    uviBadge.textContent = uvi;
    uviEl.append(uviBadge);
    cardBody.append(heading, tempEl, windEl, humidityEl);
    cardBody.append(uviEl);
    card.append(cardBody);
    heading.textContent = `${city} ${date}`;
    heading.append(weatherIcon);
    currentWeather.innerHTML = '';
    currentWeather.append(card);
}


function renderItems(city, data) {
    renderCurrentWeather(city, data);
    renderForecast(data.daily);
}

function renderForecast(forecast) {
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    heading.textContent = '5-Day Forecast';
    headingCol.append(heading);
    forecastContainer.innerHTML = '';
    forecastContainer.appendChild(headingCol);

    for (i = 1; i < 6; i++) {
        renderForecastCard(forecast[i])
    }
};

function renderForecastCard(forecast) {
    console.log(forecast)
    var unixTimeStamp = forecast.dt
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconAlt = forecast.weather[0].description;
    var tempF = forecast.temp.day
    var humidity = forecast.humidity
    var windSpeed = forecast.wind_speed

    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
    cardTitle.textContent = moment.unix(unixTimeStamp).format("MM/DD/YYYY");
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconAlt);
    tempEl.textContent = `${Math.round(tempF)} F`;
    windEl.textContent = `${Math.round(windSpeed)} MPH`;
    humidityEl.textContent = `${humidity} %`;
    forecastContainer.append(col);
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