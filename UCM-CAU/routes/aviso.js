"use strict";
const express = require("express");
const app = express();

app.get("/avisosentrantes", function (request, response) {
    let usuario = {
        email: request.session.currentEmail,
        name: request.session.currentName,
        password: request.session.currentPassword,
        image: request.session.currentImage,
        perfil: request.session.currentPerfil,
        nEmpleado: request.session.currentNEmpleado
    }
    console.log(usuario);
    response.render("avisosEntrantes.ejs", { usuario: {usuario}, errores: {} });//request.session.usuario
});

app.get("/misavisos", function (request, response) {
    response.render("misAvisos.ejs", { usuario: {}, errores: {} });//request.session.usuario
});

app.get("/historico", function (request, response) {
    response.render("historico.ejs", { usuario: {}, errores: {} });//request.session.usuario
});

app.get("/gestionusuarios", function (request, response) {
    response.render("gestionUsuarios.ejs", { usuario: {}, errores: {} });//request.session.usuario
});

module.exports = app;