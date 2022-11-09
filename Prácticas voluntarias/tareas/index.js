"use strict";
const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./data/DAOUsers");
const DAOTasks = require("./data/DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

/* daoTask.getAllTasks("bill.puertas@ucm.es", (err, result) => {
    if (err) {
        console.log(err.message);
        response.end();
    }
    else if (!result) {
        console.log("no existe ese usuario");
    }
    else {
        console.log(result);
    }
}); */

let task = {
    text: "Terminar el DAOTask",
    done: 1,
    tags: [
        "practica", "aw", "prueba"
    ]
};

daoTask.insertTask("bill.puertas@ucm.es", task, (err, result) => {
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
});
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks