// Declaracion de dependencias externas
var path = require('path');
var	mongoose = require('mongoose'); // Base de datos MongoDB

// Declaracion de dependencias internas
var Schema = mongoose.Schema;

function ejecutar(usuario, password, datosConexion, opciones, esquema, callback) {
    try {
        var parametros = {"usuario": usuario, "password": password};
        var salida = {};

        obtenerConexion(datosConexion, opciones, esquemas, function(error, conexion){
            if(!error){               
                // Validar que el modelo exista en la conexion
                var modeloAux = conexion.modelNames()[esquema];
                if(modeloAux === undefined || modeloAux == null){
                    // Agregar los esquemas
                    for(var indicek in esquemas){
                        if(esquemas[indicek].nombre == esquema){
                            conexion.model(esquemas[indicek].nombre, new Schema(esquemas[indicek].definicion), esquemas[indicek].coleccion);
                            break;
                        }
                    };                    
                };
                // ejecutar la operacion
                var modelo = conexion.model(esquema);              
                switch (nombreOperacion) {
                    case "insertar": // insertar
                        try {                            
                            var modeloAux = new modelo(parametros);
                            modeloAux.save(function(excepcionBD, respuestaBD){
                                try { 
                                    if(!excepcionBD){
                                        salida.id = respuestaBD._id;                    
                                        callback(null, salida);
                                    }
                                    else{
                                        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_insertar_resp: " + excepcionBD);                                        
                                    };
                                } catch (excepcionInesperada) {
                                    if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_insertar: " + excepcionInesperada.message);
                                }  
                            }); 
                        } catch (excepcionInesperada) {
                            if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_insertar: " + excepcionInesperada.message);
                        }            
                        break;
                    case "consultar": // consultar
                        try {
                            seleccion = seleccion.replace(/,/g, " ");
                            modelo.find(parametros).
                                select(seleccion).
                                exec(function(excepcionBD, respuestaBD){
                                    try {
                                        if(!excepcionBD){
                                            salida = respuestaBD;                   
                                            callback(null, salida);
                                        }
                                        else{
                                            if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_consultar_resp: " + excepcionBD);
                                        };
                                    } catch (excepcionInesperada) {
                                        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_consultar_resp_excepcion: " + excepcionInesperada.message);
                                    }                                    
                                });
                        } catch (excepcionInesperada) {
                            if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_consultar: " + excepcionInesperada.message);
                        }
                        break;
                    case "eliminar": // eliminar
                        try {
                            modelo.findOneAndRemove(parametros).
                            exec(function(excepcionBD, respuestaBD){
                                try {
                                    if(!excepcionBD){
                                        salida = (respuestaBD !== null ? respuestaBD : {});                   
                                        callback(null, salida);
                                    }
                                    else{
                                        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_eliminar_resp: " + excepcionBD);
                                    };
                                } catch (excepcionInesperada) {
                                    if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_eliminar: " + excepcionInesperada.message);
                                }
                            });
                        } catch (excepcionInesperada) {
                            if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_eliminar: " + excepcionInesperada.message);
                        }
                        break;
                    case "actualizar": // actualizar
                        try {
                            modelo.findOneAndUpdate(parametros.condicion, parametros.datos).
                            exec(function(excepcionBD, respuestaBD){
                                try {
                                    if(!excepcionBD){
                                        salida = (respuestaBD !== null ? respuestaBD : {});                   
                                        callback(null, salida);
                                    }
                                    else{
                                        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_actualizar_resp: " + excepcionBD);                         
                                    };
                                } catch (excepcionInesperada) {
                                    if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_actualizar: " + excepcionInesperada.message);
                                }
                            });
                        } catch (excepcionInesperada) {
                            if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_actualizar: " + excepcionInesperada.message);
                        }            
                        break;
                    default:
                        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_" + nombreOperacion + ": No se encontró la operación a ejecutar");
                };
            }
            else{
                if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_obtenerConexion: " + error.message);
            };
        });
    } catch (excepcionInesperada) {
        if(global.DEBUG) console.log(path.basename(__filename), "ConectorMongo_excepcion: " + excepcionInesperada.message);
    }
};

function obtenerConexion(datosConexion, opciones, esquemas, callback){
    try {
        var hayConexion = false;
        var conexionAux = undefined;
        var ip = datosConexion.direccion.split(":")[0];
        var puerto = datosConexion.direccion.split(":")[1];
        var basededatosURI = "mongodb://" + datosConexion.usuario + ":" + datosConexion.contraseña + "@" + ip + ":" + puerto + "/" + datosConexion.baseDatos;
        
        for(var indice1 in mongoose.connections){
            var url = (mongoose.connections[indice1].client != undefined ? mongoose.connections[indice1].client.s.url : "");
            if(url == basededatosURI){
                hayConexion = true;
                conexionAux = mongoose.connections[indice1];
                break;
            };
        }
        
        if(!hayConexion){
            if(global.DEBUG) console.log(path.basename(__filename), "obtenerConexion: " + datosConexion.baseDatos);
            // Crear la conexion a la base de datos
            var nuevaConexion = mongoose.createConnection(basededatosURI, opciones);
            nuevaConexion.on('error', function(error){
                if(global.DEBUG) console.log(path.basename(__filename), "CreacionConexionMongo: " + error.message);
                callback(error, null);
            });
            nuevaConexion.once('open', function() {
                try {
                    // Agregar los esquemas
                    for(var indicek in esquemas){
                        var esquema = esquemas[indicek];     
                        nuevaConexion.model(esquema.nombre, new Schema(esquema.definicion), esquema.coleccion);
                    };
                    callback(null, nuevaConexion); 
                } catch (excepcionInesperada) {
                    if(global.DEBUG) console.log(path.basename(__filename), "CreacionConexionMongo: " + excepcionInesperada.message);
                    callback(excepcionInesperada, null);
                }                               
            });            
        }
        else{            
            callback(null, conexionAux);
        };
    } catch(excepcionInesperada) {
        if(global.DEBUG) console.log(path.basename(__filename), "manejarError: " + excepcionInesperada.message);
        console.log("excepcionInesperada", excepcionInesperada);
        callback(excepcionInesperada, null);
    }
};

module.exports = {
    "ejecutar": ejecutar
};
