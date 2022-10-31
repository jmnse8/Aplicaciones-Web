"use strict";
const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const path = require("path");
//const fs = require("fs");
const bodyParser = require("body-parser");
//const mysql = require("mysql");
const config = require("./config.js");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//Configuración middleware sesión

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
},require('./data/pool').getPool());

const middlewareSession = session({
    saveUninitialized: false,
    secret: "footbar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

app.listen(config.port, function (err) {
    if (err) {
        console.error("No se pudo inicializar el servidor: " + err.message);
    } else {
        console.log("Servidor arrancado en el puerto " + config.port);
    }
});

const user = require("./routes/user");
const aviso = require("./routes/aviso");

app.use('/', user);
app.use('/', aviso);



