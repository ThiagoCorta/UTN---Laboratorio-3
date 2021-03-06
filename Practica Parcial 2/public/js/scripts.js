import { Mascota } from "./entidades.js";
import { RESPONSE } from "../constates/constantes.js";
import { showSpinner, hideSpinner } from "./spinner.js";
const localStorage = window.localStorage;
let selectedItem = {};
let mappedArrayData = [];
let localStorageData = JSON.parse(localStorage.getItem("arrayData"));
let arrayData = [...localStorageData];

onInit();

function alta() {
  let xhr = new XMLHttpRequest();
  const dataToSend = getFormValues();
  if (dataToSend) {
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
    return xhr.send(JSON.stringify(dataToSend));
  }
  console.error("Error al dar la alta, disculpa");
}

function baja() {
  let xhr = new XMLHttpRequest();
  if (selectedItem.id) {
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
    return xhr.send(`id=${+selectedItem.id}`);
  }
  console.error("Error no selecciono ningun elemento para dar la baja");
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
      saveDataOnLocalStorage(arrayData);
      hideSpinner();
    }
  };
  xhr.open("GET", "http://localhost:3000/traer");
  xhr.send();
}

function modify() {
  let xhr = new XMLHttpRequest();
  const formValues = getFormValues();
  if (formValues && selectedItem.id) {
    xhr.onreadystatechange = () => {
      showSpinner();
      if (xhr.readyState !== 4 || xhr.status !== 200) return;
      let dataToJson = JSON.parse(xhr.responseText);
      if (dataToJson.message === RESPONSE.MOD_EXITOSA) {
        hideSpinner();
        traer();
      }
    };
    xhr.open("POST", "http://localhost:3000/modificar");
    xhr.setRequestHeader("content-type", "application/json");
    formValues.id = selectedItem.id;
    return xhr.send(JSON.stringify(formValues));
  }
  console.error("Error al modificar, verifique los datos");
}

function makeTable(array) {
  let table = document.getElementById("table");
  table.innerHTML = "";
  createCheckboxListarray(array);
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
  btnCargarTabla.style.display = "block";
}

function createHeaders(array) {
  let row = document.createElement("tr");
  for (let key in array[0]) {
    let th = document.createElement("th");
    let icon = document.createElement("i");
    let title = formatHeader(key);
    let header = document.createTextNode(title);
    icon.className = "fas fa-sort px-2";
    th.addEventListener("click", sortTable);
    th.appendChild(header);
    th.appendChild(icon);
    row.appendChild(th);
  }
  return row;
}

function createCheckboxListarray(array) {
  let container = document.getElementById("checkboxDiv");
  if ($("#checkboxDiv").find(".custom-control").length) return;
  for (let key in array[0]) {
    if (key != "id") {
      let name = formatHeader(key);
      let div = document.createElement("div");
      let input = document.createElement("input");
      let label = document.createElement("label");
      div.className = "custom-control custom-checkbox custom-control-inline";
      input.className = "custom-control-input";
      label.className = "custom-control-label";
      input.type = "checkbox";
      input.id = name;
      label.htmlFor = name;
      label.innerText = name;
      div.appendChild(input);
      div.appendChild(label);
      container.appendChild(div);
    }
  }
  return container;
}

function loadMappedTable() {
  let array = [];
  for (let key in arrayData[0]) {
    if (key != "id") {
      let name = formatHeader(key);
      let input = document.getElementById(name);
      array[key] = input.checked;
    }
  }

  mappedArrayData = [...arrayData];
  mappedArrayData = mappedArrayData.map((obj) => {
    let payload = { id: obj["id"] };
    for (let key in array) if (array[key]) payload[key] = obj[key];
    return payload;
  });
  makeTable(mappedArrayData);
}

function resetCheckbox() {
  for (let key in arrayData[0]) {
    if (key != "id") {
      let name = formatHeader(key);
      let input = document.getElementById(name);
      if (input) input.checked = false;
    }
  }
}

function formatHeader(string) {
  return (
    string
      .toLowerCase()
      .split(" ")
      .join("_")
      .split("-")
      .join("")
      .charAt(0)
      .toUpperCase() + string.slice(1)
  );
}

function getItemId(event) {
  const cell = event.target;
  const row = cell.parentNode;
  const id = row.firstElementChild.textContent;
  btnModificar.style.display = "inline";
  btnEliminar.style.display = "inline";
  setFormData(id);
}

function setFormData(id) {
  const object = arrayData.find((item) => +item.id === +id);
  selectedItem = { ...object };
  document.getElementById("titulo").value = object.titulo;
  document.getElementById("radio").checked =
    object.animal === "Perro" ? true : false;
  document.getElementById("radio2").checked =
    object.animal === "Gato" ? true : false;
  document.getElementById("descripcion").value = object.descripcion;
  let precio = object.precio.replace("$", "");
  document.getElementById("precio").value = +precio.split(",").join("");
  document.getElementById("raza").value = object.raza;
  document.getElementById("nacimiento").value = object.fecha_nacimiento;
  document.getElementById("vacunado").value = object.vacuna;
}

function getFormValues() {
  const radioPerro = document.getElementById("radio").checked;
  const radioGato = document.getElementById("radio2").checked;
  if (radioPerro || radioGato) {
    const object = {
      titulo: document.getElementById("titulo").value,
      descripcion: document.getElementById("descripcion").value,
      precio: document.getElementById("precio").value,
      animal: radioPerro ? "Perro" : "Gato",
      raza: document.getElementById("raza").value,
      fecha_nacimiento: $("#nacimiento")[0].checkValidity()
        ? $("#nacimiento")[0].value
        : null,
      vacuna: document.getElementById("vacunado").value,
    };
    if (checkProperties(object)) return new Mascota(object);
  }
  console.error("Error al rellenar el formulario.");
}

function reset() {
  btnEliminar.style.display = "none";
  btnModificar.style.display = "none";
  selectedItem = {};
  document.getElementById("titulo").value = "";
  document.getElementById("radio").checked = false;
  document.getElementById("radio2").checked = false;
  document.getElementById("descripcion").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("raza").value = "";
  document.getElementById("nacimiento").value = "";
  document.getElementById("vacunado").value = "elegir";
  resetCheckbox();
}

function checkProperties(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === "" || obj[key] === "elegir")
      return false;
  }
  return true;
}

function saveDataOnLocalStorage(array) {
  localStorage.removeItem("arrayData");
  localStorage.setItem("arrayData", JSON.stringify(array));
}

function setMaxDateToday() {
  let today = new Date();
  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  if (day < 10) day = "0" + day;
  if (month < 10) month = "0" + month;
  today = year + "-" + month + "-" + day;
  document.getElementById("nacimiento").setAttribute("max", today);
}

function sortTable() {
  const getCellValue = (tr, idx) =>
    tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) =>
    ((v1, v2) =>
      v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
        ? v1 - v2
        : v1.toString().localeCompare(v2))(
      getCellValue(asc ? a : b, idx),
      getCellValue(asc ? b : a, idx)
    );

  document.querySelectorAll("tr:first-child th").forEach((td) =>
    td.addEventListener("click", () => {
      const table = document.getElementById("table");
      Array.from(table.querySelectorAll("tr:nth-child(n+2)"))
        .sort(
          comparer(
            Array.from(td.parentNode.children).indexOf(td),
            (this.asc = !this.asc)
          )
        )
        .forEach((tr) => table.appendChild(tr));
    })
  );
}
function onInit() {
  document.forms[0].addEventListener("submit", (event) => {
    event.preventDefault();
  });
  document.getElementById("btnGuardar").addEventListener("click", alta);
  document.getElementById("btnTraer").addEventListener("click", traer);
  document.getElementById("btnEliminar").addEventListener("click", baja);
  document.getElementById("btnModificar").addEventListener("click", modify);
  document.getElementById("btnCancelar").addEventListener("click", reset);
  document
    .getElementById("btnCargarTabla")
    .addEventListener("click", loadMappedTable);

  btnCargarTabla.style.display = "none";
  btnModificar.style.display = "none";
  btnEliminar.style.display = "none";
  setMaxDateToday();
  makeTable(localStorageData);
}
