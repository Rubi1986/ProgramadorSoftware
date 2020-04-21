// Declaracion de dependencias externas
var express = require('express');
var router = express.Router();
var jwt=require('jsonwebtoken');

var mongo =  require('./mongo');
var	config = require('./configuracion');
var jwtClave="miclave";

router.get('', function(entradaHttp, salidaHttp){
  var parametros = entradaHttp.params;
  mongo.ejecutar(parametros.usuario, parametros.password, config.datosConexion, config.opciones, config.esquema, function(error, datosUsuario){
    if(!error){
      var token=jwt.sign({
        usuario: parametros.usuario,
        },jwtClave);
      var usuario = {"usuario": parametros.usuario, "token": token}
      salida.jsonp({ 'usuario' : usuario });
    }
    else{
      salida.jsonp({ 'usuario' : {} });
    };
  });
  
});

module.exports.Ruteador = router;
