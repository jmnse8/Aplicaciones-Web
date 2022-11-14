"use strict";
const express = require("express");
const app = express();

const AvisoService = require("../services/avisoService");
let avisoService = new AvisoService();

const UserService = require("../services/userService");
let userService = new UserService();  

const temas1 = require("../resources/seleccionarTema");

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
        //console.log('Router-------');
        //console.log(avisos);
        let temas = temas1[usuario.perfil];
        response.render("misAvisos.ejs",  { usuario, panel, avisos, temas});
    });
    //request.session.usuario
});

app.get("/historico", function (request, response) {
    let panel = 3;
    let usuario = request.session.usuario;
    response.render("historico.ejs", { usuario, panel});//request.session.usuario
});

app.get("/gestionUsuarios", function (request, response) {
    let panel = 4;
    let usuario = request.session.usuario;
    if(usuario)
        if(usuario.nEmpleado != null)
            userService.getAllUsers((usuarios) => {
                response.render("gestionUsuarios.ejs",  { usuario, usuarios, panel});
            });
        else
            response.redirect("misavisos");
    else
        response.redirect("login");
    
});

app.post("/newAviso",(request, response) => avisoService.newAviso(request, response));

app.post("/search", (request, response) => {
    let panel = 0;
    let usuario = request.session.usuario;
    let buscarUsuario = request.body.checkUsuario;
    let query = request.body.query;
    if(buscarUsuario){// Solo lo puede hacer el perfil técnico
        userService.getUserByName(query, (usuarios) => {
            response.render("gestionUsuarios.ejs",  { usuario, usuarios, panel});
        });
    }
    else{
        avisoService.getAvisoByText(query, (avisos) => {
            let temas = temas1[usuario.perfil];
            response.render("misAvisos.ejs",  { usuario, avisos, panel, temas});
        });
    }
});


module.exports = app;