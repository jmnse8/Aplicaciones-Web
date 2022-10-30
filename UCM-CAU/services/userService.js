"use strict"

const { check, validationResult } = require("express-validator");
const UserDAO = require("../data/userDAO");


class UserService{
    constructor(){
        this.userDAO = new UserDAO();
    }

    login(request, response, next) {
        const errors = validationResult(request);
        let email = request.body.usuario;
        let password = request.body.clave;

        if(errors.isEmpty()){
            daoUser.getUser(email, (err, result) =>{
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
                    if(password === result.clave){

                        request.session.currentEmail = result.email;
                        request.session.currentName = result.name;
                        request.session.currentPassword = result.password;
                        request.session.currentImage = Buffer.from(result.image).toString('base64');
                        request.session.currentPerfil = result.perfil;
                        request.session.currentNEmpleado = result.nEmpleado;

                        response.redirect("/aviso/avisosEntrantes");
                    }
                    else{
                        console.log("la contraseña no coincide");
                        response.render("login", {errores: false});
                    }
                }
            })
        }
        else{ //si hay errores
            response.render("login", {errores:errors.mapped()});
        }
    };

    singup(request, response, next) {
        
        const errors = validationResult(request);

        if(errors.isEmpty()){
            this.userDAO.newUser(request.body.name, request.body.email, request.body.password, request.body.image,request.body.perfil, request.body.nEmpleado,
                (err, result) =>{
                    if(err){
                        console.log(err.message);
                        response.end();
                    }
                    else{
                        response.redirect("/login");
                    }
            })
        }
        else{ //aprender a usar esto
            response.render("signup.ejs");//, {errores: errors.mapped()}
        }
    };
};


module.exports = UserService;