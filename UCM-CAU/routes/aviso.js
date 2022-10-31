"use strict";
const express = require("express");
const app = express();

app.get("/avisosentrantes", function (request, response) {
    let usuario = request.session.usuario;
    response.render("avisosEntrantes.ejs", { usuario });//request.session.usuario
});

app.get("/misavisos", function (request, response) {
    let usuario = request.session.usuario;
    response.render("misAvisos.ejs",  { usuario });//request.session.usuario
});

app.get("/historico", function (request, response) {
    let usuario = request.session.usuario;
    response.render("historico.ejs", { usuario });//request.session.usuario
});

app.get("/gestionusuarios", function (request, response) {
    let usuario = request.session.usuario;
    response.render("gestionUsuarios.ejs", { usuario });//request.session.usuario
});

module.exports = app;