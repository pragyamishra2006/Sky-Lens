let isCelsius = true;

// 🌤 ICON
function getIcon(weather) {
    weather = weather.toLowerCase();

    if (weather.includes("cloud")) return "☁";
    if (weather.includes("rain")) return "🌧";
    if (weather.includes("clear")) return "☀";
    if (weather.includes("snow")) return "❄";
    return "🌤";
}

// 🌡 Toggle
function toggleUnit() {
    isCelsius = !isCelsius;
    getWeather();
}

// 🌍 Get Weather
async function getWeather() {
    const city = document.getElementById("city").value;
    const result = document.getElementById("result");

    if (!city) return;

    result.innerHTML = "Loading...";

    const res = await fetch(`http://localhost:3000/weather?city=${city}`);
    const data = await res.json();

    if (data.error) {
        result.innerHTML = data.error;
        return;
    }

    saveHistory(city);
    displayWeather(data);
    getForecast(city);
}

// 📍 Location Weather
function getLocationWeather() {
    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const res = await fetch(`http://localhost:3000/weather/location?lat=${lat}&lon=${lon}`);
        const data = await res.json();

        displayWeather(data);
    });
}

// 📅 Forecast
async function getForecast(city) {
    const res = await fetch(`http://localhost:3000/forecast?city=${city}`);
    const data = await res.json();

    let html = "<h3>Forecast</h3>";

    data.forEach(d => {
        html += `<p>${d.main.temp}°C - ${d.weather[0].main}</p>`;
    });

    document.getElementById("forecast").innerHTML = html;
}

// 🌧 Rain Effect
function createRain() {
    const rain = document.querySelector(".rain");
    rain.innerHTML = "";

    for (let i = 0; i < 100; i++) {
        let drop = document.createElement("span");

        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 1 + 0.5) + "s";
        drop.style.opacity = Math.random();

        rain.appendChild(drop);
    }
}

function removeRain() {
    document.querySelector(".rain").innerHTML = "";
}

// 📊 Display Weather (FINAL VERSION)
function displayWeather(data) {
    const result = document.getElementById("result");

    // 🌧 Rain detection
    if (data.weather.toLowerCase().includes("rain") ||
        data.weather.toLowerCase().includes("drizzle")) {
        createRain();
    } else {
        removeRain();
    }

    // 🌡 Temperature toggle
    let temp = data.temperature;
    if (!isCelsius) temp = (temp * 9 / 5) + 32;

    result.innerHTML = `
        <div class="weather-card">
            <h2>${data.city}</h2>
            <h1>${temp.toFixed(1)}° ${isCelsius ? "C" : "F"}</h1>
            <p>${getIcon(data.weather)} ${data.weather}</p>
            <p>💧 ${data.humidity}%</p>
            <p>🌬 ${data.wind} m/s</p>
        </div>
    `;
}

// 🧠 History
function saveHistory(city) {
    let history = JSON.parse(localStorage.getItem("cities")) || [];

    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("cities", JSON.stringify(history));
    }

    displayHistory();
}

function displayHistory() {
    let history = JSON.parse(localStorage.getItem("cities")) || [];
    const list = document.getElementById("history");

    list.innerHTML = "";

    history.forEach(city => {
        list.innerHTML += `<li onclick="quickSearch('${city}')">${city}</li>`;
    });
}

function quickSearch(city) {
    document.getElementById("city").value = city;
    getWeather();
}

// Load history on start
displayHistory();