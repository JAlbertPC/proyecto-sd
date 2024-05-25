import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';

import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";
import {consultaEfemerides} from "./scrapper.js";


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

const OPENWEATHERMAP_API_URL = process.env.OPENWEATHERMAP_API_URL;
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const OPENWEATHERMAP_URL = `${OPENWEATHERMAP_API_URL}/weather?lang=es&units=metric&appid=${OPENWEATHERMAP_API_KEY}`;

const HOLIDAY_API_URL = process.env.HOLIDAY_API_URL;
const HOLIDAY_API_KEY = process.env.HOLIDAY_API_KEY;
const HOLIDAY_URL = `${HOLIDAY_API_URL}`;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());

app.get("/", authorization.soloPublico, (req, res) =>
  res.sendFile(__dirname + "/public/html/login.html")
);
app.get("/register", authorization.soloPublico, (req, res) =>
  res.sendFile(__dirname + "/public/html/register.html")
);
app.get("/home", authorization.soloAdmin, (req, res) =>
  res.sendFile(__dirname + "/public/html/index.html")
);
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);

app.get("/noticias/:categoria",authorization.soloAdmin, async (req, res) => {
  const categoria = req.params.categoria;

  const rawInfoNews = await fetch(`${NEWS_URL}&languaje=es&q=${categoria}`);
  const newsNews = await rawInfoNews.json();

  const rawInfoGNews = await fetch(`${GNEWS_URL}&lan=es&q=${categoria}`);
  const newsGNews = await rawInfoGNews.json();

    const noticias = {noticias: []};

  for (const newNew of newsNews.articles) {
        const {title, url, urlToImage, publishedAt} = newNew;
    const name = newNew.source.name;
    noticias.noticias.push({
      title: title,
      url: url,
      image: urlToImage,
      publishedAt: publishedAt,
      name: name,
    });
  }

  for (const newGNew of newsGNews.articles) {
        const {title, url, image, publishedAt} = newGNew;
    const name = newGNew.source.name;
    noticias.noticias.push({
      title: title,
      url: url,
      image: image,
      publishedAt: publishedAt,
      name: name,
    });
  }

  res.json(noticias);
});

app.get("/imagen", authorization.soloAdmin,async (req, res) => {
  const rawInfo = await fetch(NASA_URL);
    const {copyright, date, explanation, hdurl, title, url} =
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

app.get("/clima/:lat/:long", authorization.soloAdmin,async (req, res) => {
    const {lat, long} = req.params;
  const rawInfo = await fetch(`${OPENWEATHERMAP_URL}&lat=${lat}&lon=${long}`);
  const clima = await rawInfo.json();
  res.json(clima);
});

app.get("/moneda/:comparar", authorization.soloAdmin,async (req, res) => {
  const comparar = req.params.comparar || "USD";
  const rawInfo = await fetch(
    `${FREECURRENCYEXCHANGE_URL}&base_currency=MXN&currencies=${comparar}`
  );
  const moneda = await rawInfo.json();
  res.json(moneda);
});

app.get("/celebracion", authorization.soloAdmin,async (req, res) => {
  const headers = {
    method: "GET",
        headers: {"X-Api-Key": HOLIDAY_API_KEY},
  };
  const rawInfo = await fetch(`${HOLIDAY_URL}?country=MX&year=2024`, headers);
  const celebraciones = await rawInfo.json();
  res.json(celebraciones.slice(0, 10));
});

app.get("/efemerides/:apiKey", authorization.soloAdmin,async (req, res) => {
  const efemerides = await consultaEfemerides();
  console.log(efemerides);
    res.json({efemerides: efemerides});
});

app.listen(PORT, () =>
  console.log(`El servidor está corriendo en http://localhost:${PORT}/`)
);
