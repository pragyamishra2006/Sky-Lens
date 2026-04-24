require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.static('.'));

// 🌤 Current Weather
app.get("/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) return res.json({ error: "City required" });

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.json({ error: data.message });
        }

        res.json({
            city: data.name,
            temperature: data.main.temp,
            weather: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind: data.wind.speed
        });

    } catch {
        res.json({ error: "Server error" });
    }
});

// 📅 5-day forecast
app.get("/forecast", async (req, res) => {
    const city = req.query.city;

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data.list.slice(0, 5));
});

// 📍 Location-based weather
app.get("/weather/location", async (req, res) => {
    const { lat, lon } = req.query;

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    res.json({
        city: data.name,
        temperature: data.main.temp,
        weather: data.weather[0].main,
        humidity: data.main.humidity,
        wind: data.wind.speed
    });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));