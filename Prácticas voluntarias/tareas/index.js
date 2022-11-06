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

daoTask.getAllTasks("bill.puertas@ucm.es", (err, result) =>{
    if(err){
        console.log(err.message);
        response.end();
    }
    else if(!result){
        console.log("no existe ese usuario");
        //response.render("login", {errores: false});
    }
    else{
        console.log(result);
        /* for (let it of result) {
            console.log(it.id + ' '+ it.text + ' ' + it.done);
            if(it.tags){
                for(let ut of it.tags){
                    console.log(ut);
                }
            }
            
        } */
    }
});
// Definición de las funciones callback
// Uso de los métodos de las clases DAOUsers y DAOTasks