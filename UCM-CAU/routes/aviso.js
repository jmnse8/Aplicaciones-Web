"use strict";
const express = require("express");
const app = express();
const AvisoService = require("../services/avisoService");
let avisoService = new AvisoService();

app.get("/avisosentrantes", function (request, response) {
    let panel = 1;
    let usuario = request.session.usuario;
    if(usuario)
        if(usuario.nEmpleado != null)
            response.render("avisosEntrantes.ejs", { usuario, panel});//request.session.usuario
        else
            response.redirect("misavisos");
    else
        response.redirect("login");
});

app.get("/misavisos", function (request, response) {
    let panel = 2;
    let usuario = request.session.usuario;
    avisoService.getMisAvisos(usuario, (avisos) => {
        console.log('Router-------');
        console.log(avisos);
        response.render("misAvisos.ejs",  { usuario, panel, avisos});
    });
    //request.session.usuario
});

app.get("/historico", function (request, response) {
    let panel = 3;
    let usuario = request.session.usuario;
    response.render("historico.ejs", { usuario, panel});//request.session.usuario
});

app.get("/gestionusuarios", function (request, response) {
    let panel = 4;
    let usuario = request.session.usuario;
    response.render("gestionUsuarios.ejs", { usuario, panel});//request.session.usuario
});

module.exports = app;