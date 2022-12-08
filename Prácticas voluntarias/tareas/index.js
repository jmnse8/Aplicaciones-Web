"use strict";
const config = require("./config");
const DAOTasks = require("./data/DAOTasks");
const DAOUsers = require("./data/DAOUsers");
const utils = require("./utils");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const bodyParser = require("body-parser");
const fs = require("fs");

// Crear un servidor Express.js
const app = express();
// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);
// Crear una instancia de DAOTasks

const multer = require("multer");
const multerFactory = multer({ storage: multer.memoryStorage() });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ficherosEstaticos = path.join(__dirname, "public");
app.use(express.static(ficherosEstaticos));

const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
},pool);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "footbar34",
    resave: false,
    store: sessionStore
});

app.use(middlewareSession);

// Arrancar el servidor

const daoT = new DAOTasks(pool);
const daoU = new DAOUsers(pool);

app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    }
    else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});
/*
app.use(function(request, response){
    response.status(404);
    response.render("error400", {url:request.url});
    //response.end();
});

app.use(function(error,request, response,next){
    response.status(500);
    response.render("error500", {url:request.url});
    //response.end();
});
*/

app.get("/", function(request, response){
    let usuario = request.session.usuario;
    
    if(usuario){
        daoT.getAllTasks(usuario.email, (err, res) => {
            if(err){
                console.log(err.message);
                response.status(500);
                response.end();
            }
            else if(!res){
                console.log("No tiene avisos");
                response.status(200);
                response.render("tasks.ejs", {usuario: usuario, tareas: []});
            }
            else{
                //console.log(res);
                response.status(200);
                response.render("tasks.ejs", {usuario: usuario, tareas: res});
            }
            
        })
    }
    else{
        response.redirect("login");
    }
    
});

app.get("/finish/:taskId", function(request, response){
    let taskId = Number(request.params.taskId);
    daoT.markTaskDone(taskId, (err, res) => {
        if(err){
            console.log(err.message);
            response.status(500);
            response.end();
        }
        else if(!res){
            console.log("Error al marcar la tarea como finalizada");
            response.status(500);
            response.redirect('/');
        }
        else{
            response.status(200);
            response.redirect('/');
        }
        
    })
    
});

app.get("/deleteCompleted", function(request, response) {
    let usuario = request.session.usuario;
    
    if(usuario) {
        daoT.deleteCompleted(usuario.email, (err, res) => {
            if(err) {
                console.log(err.message);
                response.status(500);
                response.end();
            }
            else if(!res) {
                console.log("Error al eliminar las tareas finalizadas");
                response.status(500);
                response.redirect('/');
            }
            else {
                response.status(200);
                response.redirect('/');
            }        
        })
    }
    else{
        response.redirect("login");
    }  
});

app.post("/addTask", function(request, response){

    let task = utils.createTask(request.body.text);

    console.log(task);
    let usuario = request.session.usuario;
    
    if(usuario){
        daoT.insertTask(usuario.email, task, (err, result) => {
            if (err) {
                console.log(err.message);
                response.status(500);
                response.end();
            }
            else if (!result) {
                console.log("no existe ese usuario");
                response.status(400);
                response.redirect('/');
            }
            else {
                response.status(200);
                response.redirect('/');
            }
        });
    }
    else{
        response.redirect("login");
    }
});



app.get("/login", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("/");
    else {
        response.status(200);
        response.render("login.ejs", { errores: {} });
    }
});



app.get("/signup", function (request, response) {
    let usuario = request.session.usuario;
    if (usuario)
        response.redirect("login");
    else
        response.render("signup.ejs", { errores: {} });
});

app.post("/signup",
    multerFactory.single('image'),
    (request, response) => {
        let imagen = null;
        if (request.file) {
            imagen = request.file.buffer;
        }
        else {
            imagen = fs.readFileSync("./public/images/noUser.png");
        }
        daoU.newUser(
            request.body.email, request.body.password, imagen,
            (err, result) => {
                if (err) {
                    console.log(err.message);
                    response.status(500);
                    response.end();
                }
                else {
                    response.status(200);
                    response.redirect("login");                         
                }
             }
        )
    }
);

app.post("/login", (request, response) => {
    let email = request.body.email;
        let password = request.body.password;

        daoU.isUserCorrect(email, (err, result) => {
                if (err) {
                    console.log(err.message);
                    response.status(500);
                    response.end();
                }
                else if (!result) {
                    console.log("No existe ese usuario");
                    response.status(400);
                    response.render("login", { errores: false });
                }
                else {
                    console.log("usuario encontrado");
                    if (password === result.password) {
                        let user = {
                            Id: result.IdUser,
                            email: result.email,
                        }
                        request.session.usuario = user;
                        response.redirect("/");
                    }
                    else {
                        console.log("La contraseña no coincide " + password + result);
                        response.render("login", { errores: false });
                    }
                }
            });
        
});

app.get("/logout", function (request, response) {
    console.log('Cierra sesión');
    response.status(200);
    request.session.destroy();
    response.redirect("login");
});

app.get("/imagen/:id", (request, response) => {
    let n = Number(request.params.id);
        if (isNaN(n)) {
            response.status(400);
            response.end("Petición incorrecta");
        } else {
            daoU.getUserImage(n, function (err, imagen) {
                if (imagen) {
                    response.status(200);
                    response.end(imagen);
                } else {
                    console.log('sin imagen');
                    response.status(404);
                    response.end("Not found"); //response.end("./public/images/logoUCM.jpg");
                }
            });
        }
    }
);

app.post("/prueba", (request, response) => {
    response.status(200)
    response.redirect("login")
});

