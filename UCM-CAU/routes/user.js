"use strict";
const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const UserService = require("../services/userService");

let userService = new UserService();


app.get("/", function (request, response) {
    response.render("login.ejs", { errores: {} });
});

app.get("/login", function (request, response) {
    response.render("login.ejs", { errores: {} });
});

app.get("/singup", function (request, response) {
    response.render("singup.ejs", { errores: {} });
});

app.post("/login",
    check("email", "campo correo vacio").notEmpty(),
    (request, response,next) => userService.login(request, response, next)
);

app.post("/singup",
    check("email", "campo correo vacio").notEmpty(),
    (request, response,next) => userService.singup(request, response, next)
);


module.exports = app;