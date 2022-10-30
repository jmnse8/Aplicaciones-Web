"use strict";
const express = require("express");
const session = require("express-session");
const path = require("path");
//const fs = require("fs");
const { check, validationResult } = require("express-validator");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const config = require("./config.js");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

const pool = mysql.createPool(config.mysqlConfig);

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
app.use('/aviso', aviso);



