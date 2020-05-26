import { Anuncio } from "./entidades.js";
import { RESPONSE } from "../constates/constantes.js";
import { showSpinner, hideSpinner } from "./spinner.js";
let arrayData = [];
let btnGuardar = document.getElementById("btnGuardar");
let btnEliminar = document.getElementById("btnEliminar");
let btnTraer = document.getElementById("btnTraer");
let btnCancelar = document.getElementById("btnCancelar");
let btnModificar = document.getElementById("btnModificar");
let selectedItem = {};

document.forms[0].addEventListener("submit", (event) => {
  event.preventDefault();
});
btnCancelar.addEventListener("click", reset);
btnTraer.addEventListener("click", traerFetch);
btnGuardar.addEventListener("click", altaFetch);
btnEliminar.addEventListener("click", bajaFetch);
btnModificar.addEventListener("click", modifyFetch);

btnEliminar.style.visibility = "hidden";
btnModificar.style.visibility = "hidden";
function alta() {
  let xhr = new XMLHttpRequest();
  showSpinner();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;
    let dataToJson = JSON.parse(xhr.responseText);
    if (dataToJson.message === RESPONSE.ALTA_EXITOSA) {
      hideSpinner();
      traer();
    }
  };
  xhr.open("POST", "http://localhost:3000/alta");
  xhr.setRequestHeader("content-type", "application/json");
  const dataToSend = getFormValues();
  if (dataToSend) return xhr.send(JSON.stringify(dataToSend));
  console.error("Error al dar la alta, disculpa");
}

function altaFetch() {
  const dataToSend = getFormValues();
  if (!dataToSend) return;
  showSpinner();
  fetch("http://localhost:3000/alta", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(dataToSend),
  })
    .then((responseText) => responseText.json())
    .then((response) => {
      if (response.message === RESPONSE.ALTA_EXITOSA) {
        hideSpinner();
        traer();
      }
    })
    .catch((error) => console.log(error));
}

function baja() {
  let xhr = new XMLHttpRequest();
  showSpinner();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;
    let dataToJson = JSON.parse(xhr.responseText);
    if (dataToJson.message === RESPONSE.BAJA_EXITOSA) {
      hideSpinner();
      traer();
    }
  };
  xhr.open("POST", "http://localhost:3000/baja");
  xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
  if (selectedItem.id) return xhr.send(`id=${+selectedItem.id}`);
  console.error("Error no selecciono ningun elemento para dar la baja");
}

function bajaFetch() {
  const dataToSend = getFormValues();
  if (!dataToSend) return;
  showSpinner();
  fetch("http://localhost:3000/baja", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: `id=${+selectedItem.id}`,
  })
    .then((responseText) => responseText.json())
    .then((response) => {
      if (response.message === RESPONSE.BAJA_EXITOSA) {
        hideSpinner();
        traer();
      }
    })
    .catch((error) => console.log(error));
}

function traer() {
  reset();
  let xhr = new XMLHttpRequest();
  showSpinner();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      arrayData = response.data;
      makeTable(arrayData);
      hideSpinner();
    }
  };
  xhr.open("GET", "http://localhost:3000/traer");
  xhr.send();
}

function traerFetch() {
  reset();
  showSpinner();
  fetch("http://localhost:3000/traer", {
    method: "GET",
  })
    .then((responseText) => responseText.json())
    .then((response) => {
      if (response.message === RESPONSE.CARGA_EXITOSA) {
        arrayData = response.data;
        makeTable(arrayData);
        hideSpinner();
      }
    })
    .catch((error) => console.log(error));
}

function modify() {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4 || xhr.status !== 200) return;
    let dataToJson = JSON.parse(xhr.responseText);
    if (dataToJson.message === RESPONSE.MOD_EXITOSA) traer();
  };
  xhr.open("POST", "http://localhost:3000/modificar");
  xhr.setRequestHeader("content-type", "application/json");
  const formValues = getFormValues();
  if (formValues && selectedItem.id) {
    formValues.id = selectedItem.id;
    return xhr.send(JSON.stringify(formValues));
  }
  console.error("Error al modificar, verifique los datos");
}

function modifyFetch() {
  const formValues = getFormValues();
  if (formValues && selectedItem.id) {
    formValues.id = selectedItem.id;
  } else {
    return console.error("Error al querer modificar, chequear los datos ");
  }
  showSpinner();
  fetch("http://localhost:3000/modificar", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(formValues),
  })
    .then((responseText) => responseText.json())
    .then((response) => {
      if (response.message === RESPONSE.MOD_EXITOSA) {
        hideSpinner();
        traer();
      }
    })
    .catch((error) => console.log(error));
}

function makeTable(array) {
  let table = document.getElementById("table");
  table.innerHTML = "";
  table.appendChild(createHeaders(array));
  for (let item of array) {
    let row = document.createElement("tr");
    for (let property in item) {
      let cell = document.createElement("td");
      cell.addEventListener("click", getItemId);
      let text = document.createTextNode(item[property]);
      cell.appendChild(text);
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

function createHeaders(array) {
  let row = document.createElement("tr");
  for (let key in array[0]) {
    let th = document.createElement("th");
    let header = document.createTextNode(key);
    th.appendChild(header);
    row.appendChild(th);
  }
  return row;
}

function getItemId(event) {
  const cell = event.target;
  const row = cell.parentNode;
  const id = row.firstElementChild.textContent;
  btnEliminar.style.visibility = "visible";
  btnModificar.style.visibility = "visible";
  setFormData(id);
}

function setFormData(id) {
  const object = arrayData.find((item) => +item.id === +id);
  selectedItem = { ...object };
  document.getElementById("titulo").value = object.titulo;
  document.getElementById("radio").checked =
    object.transaccion === "Venta" ? true : false;
  document.getElementById("radio2").checked =
    object.transaccion === "Venta" ? false : true;
  document.getElementById("descripcion").value = object.descripcion;
  let precio = object.precio.replace("$", "");
  document.getElementById("precio").value = +precio.split(",").join("");
  document.getElementById("baños").value = +object.num_wc;
  document.getElementById("autos").value = +object.num_estacionamiento;
  document.getElementById("dormitorios").value = +object.num_dormitorio;
}

function getFormValues() {
  const radioVenta = document.getElementById("radio").checked;
  const radioAlquiler = document.getElementById("radio2").checked;
  if (radioVenta || radioAlquiler) {
    const object = {
      titulo: document.getElementById("titulo").value,
      transaccion: radioVenta ? "Venta" : "Alquiler",
      descripcion: document.getElementById("descripcion").value,
      precio: document.getElementById("precio").value,
      num_wc: document.getElementById("baños").value,
      num_estacionamiento: document.getElementById("autos").value,
      num_dormitorio: document.getElementById("dormitorios").value,
    };
    if (checkProperties(object)) return new Anuncio(object);
  }
  console.error("Error al rellenar el formulario.");
}

function reset() {
  btnEliminar.style.visibility = "hidden";
  btnModificar.style.visibility = "hidden";
  selectedItem = {};
  document.getElementById("titulo").value = "";
  document.getElementById("radio").checked = false;
  document.getElementById("radio2").checked = false;
  document.getElementById("descripcion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("baños").value = "";
  document.getElementById("autos").value = "";
  document.getElementById("dormitorios").value = "";
}
function checkProperties(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === "") return false;
  }
  return true;
}
