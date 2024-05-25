//const cheerio = require("cheerio");
import cheerio from "cheerio";
const wikipediaURL = process.env.WIKIPEDIA_URL;

export async function consultaEfemerides() {

  const rawInfo = await fetch(wikipediaURL);
  const rawPagina = await rawInfo.text();

  const $ = cheerio.load(rawPagina);
  const rawListaEfemerides = $("#main-itd > ul").find("li");
  const listaEfemerides = [];

  rawListaEfemerides.each((index, efemeride) => {
    listaEfemerides.push($(efemeride).text());
  });

  return listaEfemerides;
}
