"use strict";
const config = require("./config");
const DAOTasks = require("./data/DAOTasks");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
// Crear un servidor Express.js
const app = express();
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
// Crear una instancia de DAOTasks

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));
// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});


const daoT = new DAOTasks(pool);

app.get("/", function(request, response){
    response.status(200);
    daoT.getAllTasks("bill.puertas@ucm.es", (err, res) => {
        if(err){
            console.log(err.message);
            response.end();
        }
        else if(!res){
            console.log("No tiene avisos");
            response.render("tasks.ejs", {tareas: []});
        }
        else{
            //console.log(res);
            response.render("tasks.ejs", {tareas: res});
        }
        
    })
    
});

/* daoTask.insertTask("bill.puertas@ucm.es", task, (err, result) => {
    if (err) {
        console.log(err.message);
        response.end();
    }
    else if (!result) {
        console.log("no existe ese usuario");
        //response.render("login", {errores: false});
    }
    else {
        console.log(result);
    }
}); */
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks