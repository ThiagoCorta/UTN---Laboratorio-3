"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mascota = void 0;
var Anuncio = /** @class */ (function () {
    function Anuncio(object) {
        this.id = object.id ? object.id : null;
        this.titulo = object.titulo;
        this.transaccion = "Venta";
        this.descripcion = object.descripcion;
        this.precio = object.precio;
    }
    return Anuncio;
}());
var Mascota = /** @class */ (function (_super) {
    __extends(Mascota, _super);
    function Mascota(object) {
        var _this = _super.call(this, object) || this;
        _this.animal = object.animal;
        _this.raza = object.raza;
        _this.fecha_nacimiento = object.fecha_nacimiento;
        _this.vacuna = object.vacuna;
        return _this;
    }
    return Mascota;
}(Anuncio));
exports.Mascota = Mascota;
