//Cantidad de noticias que se cargaran cada vez que se presione siguiente\
let cantidadNoticias = 9;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

function imagenDelDia() {
  fetch("http://localhost:3000/imagen/")
    .then((response) => response.json())
    .then(({ title, explanation, copyright, date, url, hdurl }) => {
      const divImagen = document.getElementById("imagen");

      const imagenDelDia = document.createElement("img");
      imagenDelDia.src = url;
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
    fetch(`http://localhost:3000/noticias/${categoria}`)
      .then((response) => response.json())
      .then((data) => this.displayNoticias(data));
  },
  displayNoticias: function (data) {
    //se elimina todo si se ha seleccionado un tema nuevo
    if (pageInicial == 0) {
      document.querySelector(".container-noticias").textContent = "";
    }
    //se carga la cantidad de noticias indicada en cantidadNoticias
    for (i = pageInicial; i <= pageFinal; i++) {
      const { title } = data.articles[i];
      let h2 = document.createElement("h2");
      h2.textContent = title;

      const { urlToImage } = data.articles[i];
      let img = document.createElement("img");
      img.setAttribute("src", urlToImage);

      let info_item = document.createElement("div");
      info_item.className = "info_item";
      const { publishedAt } = data.articles[i];
      let fecha = document.createElement("span");
      let date = publishedAt;
      date = date.split("T")[0].split("-").reverse().join("-");
      fecha.className = "fecha";
      fecha.textContent = date;

      const { name } = data.articles[i].source;
      let fuente = document.createElement("span");
      fuente.className = "fuente";
      fuente.textContent = name;

      info_item.appendChild(fecha);
      info_item.appendChild(fuente);

      const { url } = data.articles[i];

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

window.addEventListener("load", () => {
  let lon;
  let lat;

  let temperaturaValor = document.getElementById("temperatura-valor");
  let temperaturaDescripcion = document.getElementById(
    "temperatura-descripcion"
  );
  let ubicacion = document.getElementById("ubicacion");
  let iconoAnimado = document.getElementById("icono-animado");
  let vientoVelocidad = document.getElementById("viento-velocidad");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((posicion) => {
      console.log(posicion);
      lon = posicion.coords.longitude;
      lat = posicion.coords.latitude;

      //ubicacion actual
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&units=metric&appid=95bef9bb448ce3cea02ada399cc278e8`;

      //ubicacion por ciudad
      //const url = "https://api.openweathermap.org/data/2.5/weather?q=Merida,mx&callback=test&appid=95bef9bb448ce3cea02ada399cc278e8"

      //console.log(url)
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          let temp = Math.round(data.main.temp);
          temperaturaValor.textContent = `${temp} °C`;

          let desc = data.weather[0].description;
          temperaturaDescripcion.textContent = desc.toUpperCase();

          ubicacion.textContent = data.name;

          vientoVelocidad.textContent = `${data.wind.speed} m/s`;
          console.log(data.name);

          //iconos estaticos
          /*
                          console.log(data.weather[0].icon)
                          let iconCode = data.weather[0].icon
                          const urlIcon = `https://openweathermap.org/img/wn/${iconCode}.png`
                          console.log(urlIcon)
                          */

          //para iconos dinámicos
          console.log(data.weather[0].main);
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
});
