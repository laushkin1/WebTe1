const WEATHER_URL = 
    "https://api.open-meteo.com/v1/forecast" + 
    "?latitude=48.15" + 
    "&longitude=17.11" + 
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=auto";

fetch(WEATHER_URL)
    .then(response => response.json())
    .then(data => {

        const temperature = data.current.temperature_2m;
        const wind = data.current.wind_speed_10m;
        const time = data.current.time;
        const city = data.timezone;
        const timezone = data.timezone_abbreviation;

        document.getElementById("weather").innerHTML =
            "Temperature " + temperature + "°C" + "<br>" +
            "Wind " + wind + "km/h" + "<br>" +
            "Current time " + time + "(" + timezone + ")" + "<br>" +
            "Current place " + city;

    })
    .catch(error => {

        document.getElementById("weather").innerHTML =
            "Unable to load the weather";

        console.error(error);

    });

const map = L.map("map").setView(
    [48.151965, 17.072995],
    15
);

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom: 19,
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
).addTo(map);

L.marker([48.151965, 17.072995])
    .addTo(map)
    .bindPopup("FEI STU Bratislava")
    .openPopup();