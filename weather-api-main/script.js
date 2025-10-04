// storage 

let weatherHead = document.getElementById("weatherHead");
let notCorrectCity = document.getElementById("notCorrectCity");
let cityWeather = "";
let weatherArray = [];

// cityName
let cityName = document.getElementById("cityName");
let cityNameError = document.getElementById("cityNameError");
let cityCorrect = false;
cityName.addEventListener("input", function () {

    let cityNameRegex = /^[a-zA-Z]+$/;

    if (cityName.value == "") {
        cityNameError.innerText = "Enter City name";
        cityCorrect = false;
    }
    else if (!cityName.value.match(cityNameRegex)) {
        cityNameError.innerText = "City can only have letters";
        cityName.value = "";
        cityCorrect = false;
    }
    else {
        cityNameError.innerText = "";
        cityCorrect = true;
    }
});

// search
let search = document.getElementById("search");
search.addEventListener("click", function () {
    if (cityCorrect == false) {
        cityNameError.innerText = "Enter city name";
    }
    else {
        gettingWeatherData();

    }
});

// on enter
cityName.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        if (cityCorrect == false) {
            cityNameError.innerText = "Enter city name";
        }
        else {
            gettingWeatherData();

        }
    }
});


let gettingWeatherData = async () => {

    const ApiKey = "cfc30ccfdca72bb56781f6ce0383a73e";
    let URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName.value.trim()}&appid=${ApiKey}&units=metric`;

    let response = await fetch(URL);
    let data = await response.json();

    if (response.status == 200) {
        weatherHead.innerHTML = "";
        cityWeather = `<div id="cityWeather">
            <div class="container">
                <div class="d-flex align-items-center justify-content-center">
                    <div id="weatherAbout">
                        <div> ${data.weather[0].main}</div>
                    </div>
        
                    <div id="weatherIcon">
                        <img id="icon" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" />
                    </div>
                </div>

                <div id="temp">
                ${data.main["temp"]}°C
                </div>

                <div id="cityName">${data.name}</div>

                <div id="otherDetails">
                    <div id="humidity">
                        <i class="fa-regular fa-droplet-percent"></i>
                        <div>
                            <span id="humidityData">${data.main["humidity"]}<span>%</span></span>
                            <div>Humidity</div>
                        </div>
                    </div>

                    <div id="speed">
                        <i class="fa-regular fa-wind"></i>
                        <div>
                            <span id="speedData">${data.wind["speed"]}<span>km/h</span></span>
                            <div>Wind Speed</div>
                        </div>
                    </div>
                </div>
                </div>

            </div>`;

        let obj = {
            "Weather": data.weather[0].main,
            "Weather Icon": data.weather[0].icon,
            "City": data.name,
            "Temperature": data.main["temp"],
            "Humidity": data.main["humidity"],
            "Wind Speed": data.wind["speed"],
        }

        weatherArray = obj;
        sessionStorage.setItem("savedData", JSON.stringify(weatherArray));
        weatherHead.innerHTML = cityWeather;
    }
    else {
        notCorrectCity.style.display = "block";
    }
};

function getWeather() {
    let get = JSON.parse(sessionStorage.getItem("savedData"));

    cityName.setAttribute("placeholder", get.City)

    if (get) {
        weatherHead.innerHTML = `
        <div id="cityWeather">
        <div class="container">
            <div class="d-flex align-items-center justify-content-center">
                <div id="weatherAbout">
                    <div>${get.Weather}</div>
                </div>
                <div id="weatherIcon">
                    <img id="icon" src="https://openweathermap.org/img/wn/${get["Weather Icon"]}@2x.png" alt="weather icon" />
                </div>
            </div>

            <div id="temp">${get["Temperature"]}°C</div>
            <div id="cityName">${get.City}</div>

            <div id="otherDetails">
                <div id="humidity">
                    <div>
                        <span id="humidityData">${get["Humidity"]}<span>%</span></span>
                        <div>Humidity</div>
                    </div>
                </div>

                <div id="speed">
                    <div>
                        <span id="speedData">${get["Wind Speed"]}<span>km/h</span></span>
                        <div>Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    `;
    }
    else {
        // gettingWeatherData();
        notCorrectCity.style.display = "block";
    }
}

getWeather();