export class Anuncio {
  id;
  titulo;
  transaccion;
  descripcion;
  precio;
  num_wc;
  num_estacionamiento;
  num_dormitorio;

  constructor(object) {
    this.id = object.id ? object.id : null;
    this.titulo = object.titulo;
    this.transaccion = object.transaccion;
    this.descripcion = object.descripcion;
    this.precio = object.precio;
    this.num_wc = object.num_wc;
    this.num_estacionamiento = object.num_estacionamiento;
    this.num_dormitorio = object.num_dormitorio;
  }
}
