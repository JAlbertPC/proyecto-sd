//Cantidad de noticias que se cargaran cada vez que se presione siguiente\
let cantidadNoticias = 5;
let pageFinal = cantidadNoticias;
let pageInicial = 0;
let temaActual = "Tecnología";

let noticias = {
  fetchNoticias: function (categoria) {
    fetch(
      "https://newsapi.org/v2/everything?q=" +
        categoria +
        "&languaje=es&apiKey=" +
        this.apiKey
    )
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
