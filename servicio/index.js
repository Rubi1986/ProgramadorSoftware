// Declaracion de dependencias externas
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');
var expressJwt=require('express-jwt');

// Declaracion de dependencia internas
var ruteador = require('./ruteo').Ruteador;

// Declaracion de variables
global.DEBUG = true;
/**
 * Crear aplicación para HTTP
 */
var aplicacionHttp = express();
var RouterHttp = express.Router();
// Usar bodyParser para optener informacion de un POST o de la URL.
aplicacionHttp.use(bodyParser.urlencoded( { extended:true } ) );
aplicacionHttp.use(bodyParser.json());
// Usar fileUpload para obtener los datos de documentos en un POST
aplicacionHttp.use(fileUpload());

// habilitar peticiones de cruce de dominios.
aplicacionHttp.use(function (req, res, next) {
  // Habilitar que cualquier sitio web se pueda conectar.
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Habilitar que cualquiera de los siguientes metods se pueda recibir.
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  // Habilitar el siguiente encabezado de peticion.
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, modoDepuracion');
  // Habilitar el uso de cookies en la peticion.
  res.setHeader('Access-Control-Allow-Credentials', true);
  // pasar a la siguiente etapa de la rest-api.
  next();
});

var jwtClave="miclave";
aplicacionHttp.use(expressJwt({secret:jwtClave}).unless({path: ["/login"]}));

aplicacionHttp.use(function(err, req, res, next){
  if(!error){
    next();
  }
  else{
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: {}
    });
  };
});

// Agregar ruteos
aplicacionHttp.use(ruteador);

// Crear servidor http
var servidorHttp = http.createServer(aplicacionHttp);

// Iniciar el puerto de escucha
servidorHttp.listen(3000);

// Manejar evento de error de inicio de servidor
servidorHttp.on("error", function(error){
  if(global.DEBUG) console.log(path.basename(__filename), "manejarError: " + error.message);
  console.log("manejarError", error);
  process.exit(1);
});

// Manejar evento de inicio exitoso del servidor
servidorHttp.on("listening", function(){
  var direccionServidor = servidorHttp.address();
  var descripcion = typeof direccionServidor === 'string' ? direccionServidor : direccionServidor.port;
  descripcion = 'http://localhost:' + descripcion + rutaServicio;
  if(global.DEBUG) console.log(path.basename(__filename),"Aplicacion http escuchando en: " + descripcion);
});