//Cantidad de noticias que se cargaran cada vez que se presione siguiente\
let cantidadNoticias = 8;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";
let festividadVisible = false;
let efemeridesVisible = false;
const urlApi = "http://localhost:3000";

function imagenDelDia() {
  fetch(`${urlApi}/imagen/`)
    .then((response) => response.json())
    .then(({ title, explanation, copyright, date, url, hdurl }) => {
      const divImagen = document.getElementById("imagen");

      const imagenDelDia = document.createElement("img");
      imagenDelDia.src = hdurl;
      imagenDelDia.alt = title;

      const divInformacion = document.createElement("div");
      divInformacion.className = "informacion";

      const informacion = document.createElement("h1");
      informacion.innerHTML = title;

      const explicacion = document.createElement("p");
      explicacion.innerHTML = explanation;

      divInformacion.appendChild(informacion);
      divInformacion.appendChild(explicacion);

      divImagen.appendChild(imagenDelDia);
      divImagen.appendChild(divInformacion);
    });
}

let noticias = {
  fetchNoticias: function (categoria) {
    fetch(`${urlApi}/noticias/${categoria}`)
      .then((response) => response.json())
      .then((data) => this.displayNoticias(data));
  },
  displayNoticias: function (data) {
    //se elimina todo si se ha seleccionado un tema nuevo}
    if (pageInicial == 0) {
      document.querySelector(".container-noticias").textContent = "";
    }
    //se carga la cantidad de noticias indicada en cantidadNoticias
    for (let i = pageInicial; i <= pageFinal; i++) {
      const { title } = data.noticias[i];
      let h2 = document.createElement("h2");
      h2.textContent = title;

      const { image } = data.noticias[i];
      let img = document.createElement("img");
      img.setAttribute("src", image);

      let info_item = document.createElement("div");
      info_item.className = "info_item";

      const { publishedAt } = data.noticias[i];
      let fecha = document.createElement("span");
      let date = publishedAt;
      date = date.split("T")[0].split("-").reverse().join("-");
      fecha.className = "fecha";
      fecha.textContent = date;

      const { name } = data.noticias[i];
      let fuente = document.createElement("span");
      fuente.className = "fuente";
      fuente.textContent = name;

      info_item.appendChild(fecha);
      info_item.appendChild(fuente);

      const { url } = data.noticias[i];

      let item = document.createElement("div");
      item.className = "item";
      item.appendChild(h2);
      item.appendChild(img);
      item.appendChild(info_item);
      item.setAttribute("onclick", "location.href='" + url + "'");
      document.querySelector(".container-noticias").appendChild(item);
    }

    //agregamos un boton para cargar mas noticias
    let btnSiguiente = document.createElement("span");
    btnSiguiente.id = "btnSiguiente";
    btnSiguiente.textContent = "Ver más";
    btnSiguiente.setAttribute("onclick", "siguiente()");
    document.querySelector(".container-noticias").appendChild(btnSiguiente);
  },
};

function buscar(cat) {
  //Seteamos los valores
  pageInicial = 0;
  pageFinal = cantidadNoticias;
  temaActual = cat;
  noticias.fetchNoticias(cat);
}

function buscarTema() {
  pageInicial = 0;
  pageFinal = cantidadNoticias;

  let tema = document.querySelector("#busqueda").value;
  temaActual = tema;
  noticias.fetchNoticias(temaActual);
}

function siguiente() {
  pageInicial = pageFinal + 1;
  pageFinal = pageFinal + cantidadNoticias + 1;
  //Se elimina el boton siguiente
  document.querySelector("#btnSiguiente").remove();
  noticias.fetchNoticias(temaActual);
}

noticias.fetchNoticias(temaActual);
imagenDelDia();

let lon;
let lat;

let temperaturaValor = document.getElementById("temperatura-valor");
let temperaturaDescripcion = document.getElementById("temperatura-descripcion");
let ubicacion = document.getElementById("ubicacion");
let iconoAnimado = document.getElementById("icono-animado");
let vientoVelocidad = document.getElementById("viento-velocidad");

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((posicion) => {
    lon = posicion.coords.longitude;
    lat = posicion.coords.latitude;

    fetch(`${urlApi}/clima/${lat}/${lon}`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let temp = Math.round(data.main.temp);
        temperaturaValor.textContent = `${temp} °C`;

        let desc = data.weather[0].description;
        temperaturaDescripcion.textContent = desc.toUpperCase();

        ubicacion.textContent = data.name;

        vientoVelocidad.textContent = `${data.wind.speed} m/s`;

        //iconos estaticos
        /*
                          console.log(data.weather[0].icon)
                          let iconCode = data.weather[0].icon
                          const urlIcon = `https://openweathermap.org/img/wn/${iconCode}.png`
                          console.log(urlIcon)
                          */

        //para iconos dinámicos
        switch (data.weather[0].main) {
          case "Thunderstorm":
            iconoAnimado.src = "images/animated/thunder.svg";
            console.log("TORMENTA");
            break;
          case "Drizzle":
            iconoAnimado.src = "images/animated/rainy-2.svg";
            console.log("LLOVIZNA");
            break;
          case "Rain":
            iconoAnimado.src = "images/animated/rainy-7.svg";
            console.log("LLUVIA");
            break;
          case "Snow":
            iconoAnimado.src = "images/animated/snowy-6.svg";
            console.log("NIEVE");
            break;
          case "Clear":
            iconoAnimado.src = "images/animated/day.svg";
            console.log("LIMPIO");
            break;
          case "Atmosphere":
            iconoAnimado.src = "images/animated/weather.svg";
            console.log("ATMOSFERA");
            break;
          case "Clouds":
            iconoAnimado.src = "images/animated/cloudy-day-1.svg";
            console.log("NUBES");
            break;
          default:
            iconoAnimado.src = "images/animated/cloudy-day-1.svg";
            console.log("por defecto");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

function divisaDelDia() {
  fetch(`${urlApi}/moneda/USD`)
    .then((response) => response.json())
    .then(({ data }) => {
      //const pesoText = document.getElementById("valor-peso")

      const cambio = data.USD;
      const monedaCambio = document.getElementById("moneda-cambio");
      const valorCambio = document.getElementById("valor-cambio");

      monedaCambio.innerHTML = "USD";
      valorCambio.innerHTML = `$${parseFloat(cambio).toFixed(2)}`;
    });
}

divisaDelDia();

const tableBody = document.getElementById("table-body");
const countryCode = "MX";
const year = 2024;

getHolidayData(countryCode, year);

async function getHolidayData(countryCode, year) {
  const url = `${urlApi}/celebracion`;
  let response = await fetch(url);
  let result = await response.json();

  addRows(result);
}

function addRows(result) {
  for (let i = 0; i < result.length; i++) {
    let row = tableBody.insertRow(i);
    let dateCell = row.insertCell(0);
    let dayCell = row.insertCell(1);
    let nameCell = row.insertCell(2);

    dateCell.innerHTML = result[i].date;
    dayCell.innerHTML = result[i].day;
    nameCell.innerHTML = result[i].name;
  }
}

function mostrarFestividades() {
  const efemerides = document.getElementById("efemerides");
  efemerides.style.display = "none";
  efemeridesVisible = false;

  const festividades = document.getElementById("festividades");
  !festividadVisible
    ? (festividades.style.display = "block")
    : (festividades.style.display = "none");
  festividadVisible = !festividadVisible;
}

function efemeridesDelDia() {
  fetch(`${urlApi}/efemerides`)
    .then((response) => response.json())
    .then(({ efemerides }) => {
      //const pesoText = document.getElementById("valor-peso")

      const efemeridesDiv = document.getElementById("efemerides");
      for (const efemeride of efemerides) {
        const text = document.createElement("p");
        text.innerHTML = efemeride;
        efemeridesDiv.appendChild(text);
      }
    });
}

function mostrarEfemerides() {
  const festividades = document.getElementById("festividades");
  festividades.style.display = "none";
  festividadVisible = false;

  const efemerides = document.getElementById("efemerides");
  !efemeridesVisible
    ? (efemerides.style.display = "block")
    : (efemerides.style.display = "none");
  efemeridesVisible = !efemeridesVisible;
}

efemeridesDelDia();
