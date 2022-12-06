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

app.post("/login",
    check("email", "campo correo vacio").notEmpty(),
    (request, response, next) => userService.login(request, response, next)
);

app.get("/signup", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("login.ejs");
    else
        response.render("signup.ejs", { errores: {} });
});

app.post("/signup",
    multerFactory.single('image'),
    check("name", "Rellene el campo Nombre").notEmpty(),
    check("email", "El formato del correo no es correcto").matches(/\S+@\S+\.\S+/),
    check("password", "Rellene el campo Contraseña").notEmpty(),
    check("password", "No cumple con la longitud solicitada").isLength({ min: 8, max: 16 }),
    check("password", "El formato de la contraseña no es correcto").matches(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/),
    (request, response) => {
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

app.post("/borrarUsuario/:idUsu", (request, response) => {
    let idUsu = Number(request.params.idUsu);
    userService.deleteUser(idUsu, () => response.redirect("/gestionUsuarios"));
    //console.log(idAvi);
});


module.exports = app;