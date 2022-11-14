"use strict";
const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const UserService = require("../services/userService");

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

let userService = new UserService();


app.get("/", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("avisosentrantes");
    else
        response.render("login.ejs", { errores: {} });
});

app.get("/login", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("avisosentrantes");
    else
        response.render("login.ejs", { errores: {} });
});

app.get("/signup", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("avisosentrantes");
    else
        response.render("signup.ejs", { errores: {} });
});

app.post("/login",
    check("email", "campo correo vacio").notEmpty(),
    (request, response, next) => userService.login(request, response, next)
);

app.post("/signup",
    multerFactory.single('image'),
    check("email", "campo correo vacio").notEmpty(),
    (request, response) => {
        //console.log(request.file);
        userService.signup(request, response, request.file);
    }
);

app.get("/logout", function (request, response) {
    console.log('Cierra sesión');
    response.status(200);
    request.session.destroy();
    response.redirect("login");
});

app.get("/imagen/:id", (request, response) =>
    userService.getImage(request, response)
);

app.get("/myprofile", function (request, response) {
    let panel = 0;
    let usuario = request.session.usuario;
    let usuarioEn = usuario;
    if (usuario)
        response.render("profile.ejs", { usuario, panel, usuarioEn });
    else
        response.redirect("login");

});

app.get("/profile/:id", function (request, response) {
    let usuario = request.session.usuario;
    let panel = 0;
    let idUsu = Number(request.params.id);
    if (isNaN(idUsu)) {
        response.status(400);
        response.end("Petición incorrecta");
    } else {
        userService.getProfile(idUsu, (usuarioEn) => {
            if (usuario)
                response.render("profile.ejs", { usuario, panel, usuarioEn });
            else
                response.redirect("login");
        });
    }
});


module.exports = app;