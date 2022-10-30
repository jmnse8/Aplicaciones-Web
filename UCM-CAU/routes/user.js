"use strict";
const express = require("express");
const app = express();

app.get("/", function (request, response) {
    response.render("login.ejs", { errores: {} });
});

app.get("/login", function (request, response) {
    response.render("login.ejs", { errores: {} });
});

app.get("/singup", function (request, response) {
    response.render("singup.ejs", { errores: {} });
});

app.post("/singup",);


module.exports = app;