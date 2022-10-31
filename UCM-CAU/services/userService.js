"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const UserDAO = require("../data/userDAO");




class UserService{
    constructor(){
        this.userDAO = new UserDAO();
    }

    login(request, response, next) {
        const errors = validationResult(request);
        let email = request.body.email;
        let password = request.body.password;

        if(errors.isEmpty()){
            this.userDAO.getUser(email, (err, result) =>{
                if(err){
                    console.log(err.message);
                    response.end();
                }
                else if(!result){
                    console.log("no existe ese usuario");
                    response.render("login", {errores: false});
                }
                else{
                    console.log("usuario encontrado");
                    if(password === result.contraseña){
                        let user = {
                            id : result.Id,
                            email : result.email,
                            name : result.nombre,
                            password : result.contraseña,
                        //let bitmap = fs.readFileSync(result.imagen);
                            //image : Buffer.from(result.Imagen).toString('base64'),
                            perfil : result.perfil,
                            nEmpleado : result.nEmpleado,
                            activo : result.activo
                        }
                        request.session.usuario = user;
                        response.redirect("avisosEntrantes");
                    }
                    else{
                        console.log("la contraseña no coincide" + password);
                        response.render("login", {errores: false});
                    }
                }
            })
        }
        else{ //si hay errores
            console.log("la contraseña no coincide");
            response.render("login", {errores:errors.mapped()});
        }
    };

    singup(request, response, reqFile) {
        let imagen = null;
        if (reqFile) {
            imagen = request.file.buffer ;
        }
        else{
            imagen = fs.readFileSync("./public/images/logoUCM.jpg");
        }
        console.log(imagen);
        const errors = validationResult(request);

        if(errors.isEmpty()){
            this.userDAO.newUser(
                request.body.name, request.body.email, request.body.password,
                 imagen, request.body.perfil, request.body.nEmpleado,
                (err, result) =>{
                    if(err){
                        console.log(err.message);
                        response.end();
                    }
                    else{
                        this.userDAO.getUser(request.body.email, (err, result) => {
                            let user = {
                                id : result.Id,
                                email : result.email,
                                name : result.nombre,
                                password : result.contraseña,
                            //let bitmap = fs.readFileSync(result.imagen);
                                //image : Buffer.from(result.Imagen).toString('base64'),
                                perfil : result.perfil,
                                nEmpleado : result.nEmpleado,
                                activo : result.activo
                            }
                            request.session.usuario = user;
                            response.redirect("avisosEntrantes");
                        });
                    }
            });
        }
        else{ //aprender a usar esto
            response.render("signup.ejs");//, {errores: errors.mapped()}
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
};




module.exports = UserService;