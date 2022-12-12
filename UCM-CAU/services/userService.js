"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const UserDAO = require("../data/userDAO");

class UserService {
    constructor() {
        this.userDAO = new UserDAO();
    }

    login(request, response, next) {
        const errors = validationResult(request);
        let email = request.body.email;
        let password = request.body.password;

        if (errors.isEmpty()) {
            this.userDAO.getUser(email, (err, result) => {
                if (err) {
                    console.log(err.message);
                    response.end();
                }
                else if (!result) {
                    console.log("no existe ese usuario");
                    let errores = errors.array();
                    errores.push({param: 'error', msg: "El correo o la contraseña están mal"})
                    response.render("login", { errores: errores });
                }
                else {
                    console.log("usuario encontrado");
                    if (password === result.contraseña) {
                        let user = {
                            Id: result.Id,
                            email: result.email,
                            nombre: result.nombre,
                            contraseña: result.contraseña,
                            perfil: result.perfil,
                            nEmpleado: result.nEmpleado,
                            activo: result.activo,
                            nAvisos: result.nAvisos,
                            nIncidencias: result.nIncidencias,
                            nSugerencias: result.nSugerencias,
                            nFelicitaciones: result.nFelicitaciones,
                            fecha: result.fecha
                            
                        }
                        request.session.usuario = user;
                        response.redirect("avisosEntrantes");
                    }
                    else {
                        let errores = errors.array();
                        errores.push({param: 'error', msg: "El correo o la contraseña están mal"})
                        response.render("login", { errores: errores });
                    }
                }
            });
        }
        else {
            response.render("login", { errores: errors.array() });
        }
    };

    signUp(request, response, reqFile) {
        let imagen = null;
        if (reqFile) {
            imagen = request.file.buffer;
        }
        else {
            imagen = fs.readFileSync("./public/images/logoUCM.jpg");
        }
        // Password Format
        let password = true;
        if (request.body.password !== request.body.password2){
            password = false;
        }
        let up = request.body.password.toUpperCase();
        let low = request.body.password.toLowerCase();
        if (request.body.password === low || request.body.password === up) {
            password = false
        }
        // Number Employee Format
        let employeeNumber = true;
        if (request.body.perfil === "pas"){
            if (request.body.checkEmpleado) {
                if (request.body.nEmpleado.length != 8)
                    employeeNumber = false;
                else {
                    let regExp = /^[0-9]{4}-[a-z]{3}$/;  // mirar sintaxis // 4 digitos, guion, 3 letras minusculas
                    employeeNumber = regExp.test(request.body.nEmpleado);
                }
            }
        }
        const errors = validationResult(request);
        
        if (errors.isEmpty() && password && employeeNumber) { 
            this.userDAO.newUser(
                request.body.name, request.body.email, request.body.password,
                imagen, request.body.perfil, request.body.nEmpleado,
                (err) => {
                    if (err) {
                        console.log(err.message);
                        response.status(500);
                        response.end();
                    }
                    else {
                        response.status(200);
                        response.render("login", { errores: false });   
                    } 
                });
        }
        else {
            let errores = errors.array();
            if(!password){
                errores.push({param: password, msg: "Las contraseñas no son iguales o son todas mayusculas o minusculas", value: request.body.password})
            }
            if(!employeeNumber){
                errores.push({param: password, msg: "El formato del numero de empleado es incorrecto", value: request.body.employeeNumber})
            }
            response.render("signUp.ejs", { errors: errores});//, {errores: errors.mapped()}
        }        
    };

    getImage(request, response) {
        let n = Number(request.params.id);
        if (isNaN(n)) {
            response.status(400);
            response.end("Petición incorrecta");
        } else {
            this.userDAO.obtenerImagen(n, function (err, imagen) {
                if (imagen) {
                    response.end(imagen);
                } else {
                    response.status(404);
                    response.end("Not found");
                    //response.end("./public/images/logoUCM.jpg");
                }
            });
        }
    };

    getAllUsers(callback) {
        this.userDAO.getAllUsers((err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("no hay usuarios activos");
                callback(false);
            }
            else {
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });
    };

    getUserByName(query, callback) {
        this.userDAO.getUserByName(query,(err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("no hay usuarios con ese nombre");
                callback(false);
            }
            else {
                callback(result);
            }
        });
    }

    getProfile(idUsu, callback) {

        this.userDAO.getUserById(idUsu, function (err, user) {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!user) {
                console.log("usuaio no encontrado");
                callback(false);
            }
            else {
                callback(user);
            }
        });

    };

    deleteUser(idUsu, callback) {
        this.userDAO.deleteUser(idUsu, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No existe el usurio");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(result);
            }
        });
    };
};




module.exports = UserService;