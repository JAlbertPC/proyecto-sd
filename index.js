const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

const NASA_API_URL = process.env.NASA_API_URL;
const NASA_API_KEY = process.env.NASA_API_KEY;
const NASA_URL = `${NASA_API_URL}?api_key=${NASA_API_KEY}`;

const NEWS_API_URL = process.env.NEWS_API_URL;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_URL = `${NEWS_API_URL}/everything?apiKey=${NEWS_API_KEY}`;

const FREECURRENCYEXCHANGE_API_URL = process.env.FREECURRENCYEXCHANGE_API_URL;
const FREECURRENCYEXCHANGE_API_KEY = process.env.FREECURRENCYEXCHANGE_API_KEY;
const FREECURRENCYEXCHANGE_URL = `${FREECURRENCYEXCHANGE_API_URL}?apikey=${FREECURRENCYEXCHANGE_API_KEY}`;

const GNEWS_API_URL = process.env.GNEWS_API_URL;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_URL = `${GNEWS_API_URL}/search?apikey=${GNEWS_API_KEY}`;

const OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY
const OPENWEATHERMAP_URL = `${OPENWEATHERMAP_API_URL}/weather?lang=es&units=metric&appid=${OPENWEATHERMAP_API_KEY}`

const HOLIDAY_API_URL  = process.env.HOLIDAY_API_URL
const HOLIDAY_API_KEY = process.env.HOLIDAY_API_KEY
const HOLIDAY_URL = `${HOLIDAY_API_URL}`

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "html/index.html"));
});

app.get("/noticias/:categoria", async (req, res) => {
  const categoria = req.params.categoria;

  const rawInfoNews = await fetch(`${NEWS_URL}&languaje=es&q=${categoria}`);
  const newsNews = await rawInfoNews.json();
  console.log("noticias");
  console.log(newsNews);


  const rawInfoGNews = await fetch(`${GNEWS_URL}&lan=es&q=${categoria}`);
  const newsGNews = await rawInfoGNews.json();
  console.log("noticias espacio");
  console.log(newsGNews);

  

  res.json(newsNews);
});

app.get("/imagen", async (req, res) => {
  /*
      {
          "copyright": "Christophe Vergnes",
          "date": "2024-05-23",
          "explanation": "Spiral galaxy NGC 3169 looks to be unraveling like a ball of cosmic yarn. It lies some 70 million light-years away, south of bright star Regulus toward the faint constellation Sextans. Wound up spiral arms are pulled out into sweeping tidal tails as NGC 3169 (left) and neighboring NGC 3166 interact gravitationally. Eventually the galaxies will merge into one, a common fate even for bright galaxies in the local universe. Drawn out stellar arcs and plumes are clear indications of the ongoing gravitational interactions across the deep and colorful galaxy group photo. The telescopic frame spans about 20 arc minutes or about 400,000 light-years at the group's estimated distance, and includes smaller, bluish NGC 3165 to the right. NGC 3169 is also known to shine across the spectrum from radio to X-rays, harboring an active galactic nucleus that is the site of a supermassive black hole.",
          "hdurl": "https://apod.nasa.gov/apod/image/2405/N3169N3166Final.jpg",
          "media_type": "image",
          "service_version": "v1",
          "title": "Unraveling NGC 3169",
          "url": "https://apod.nasa.gov/apod/image/2405/N3169N3166Final1024.jpg"
      }
      */
     
  const rawInfo = await fetch(NASA_URL);
  const { copyright, date, explanation, hdurl, title, url } =
    await rawInfo.json();
  res.json({
    title,
    explanation,
    copyright,
    date,
    url,
    hdurl,
  });
});

app.get("/clima/:lat/:long", async (req, res) => {
  const {lat, long} = req.params
  const rawInfo = await fetch(`${OPENWEATHERMAP_URL}&lat=${lat}&lon=${long}`)
  const clima =  await rawInfo.json();
  res.json(clima);
});

app.get("/moneda/:comparar", async (req,res) => { 

  const comparar = req.params.comparar || "USD";
  const rawInfo = await fetch(`${FREECURRENCYEXCHANGE_URL}&base_currency=MXN&currencies=${comparar}`)
  const moneda = await rawInfo.json();
  res.json(moneda);

});

app.get("/celebracion", async (req, res) => {
  const headers = {
    method: 'GET',
  headers: {'X-Api-Key': HOLIDAY_API_KEY } 
}
  const rawInfo = await fetch(`${HOLIDAY_URL}?country=MX&year=2024`, headers);
  const celebraciones = await rawInfo.json()
  res.json(celebraciones.slice(0, 10));
})

app.listen(PORT, () =>
  console.log(`El servidor está corriendo en http://localhost:${PORT}/`)
);
