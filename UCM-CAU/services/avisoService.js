"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const AvisoDAO = require("../data/avisoDAO");

class AvisoService {
    constructor(){
        this.avisoDAO = new AvisoDAO();
    }

    getMisAvisos(user, callback){
        //const errors = validationResult(request);
        this.avisoDAO.getMisAvisos(user.Id, (err, result) => {
            if(err){
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if(!result){
                console.log("No tiene avisos");
                callback(false);
                //response.render("login", {errores: false});
            }
            else{
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });
    }

    newAviso(request, response) {
        const errors = validationResult(request);

        if(errors.isEmpty()){
            let fecha = new Date().toISOString();
            let usuario = request.session.usuario;

            let categoria = request.body.radio;
            let tema;
            if(categoria === 'felicitacion'){
                tema = request.body.fel;
            }
            else{
                tema = request.body.suginc;
            }
            this.avisoDAO.newAviso(usuario.Id, tema, 
                request.body.observaciones, categoria, fecha,
                (err, result) =>{
                    if(err){
                        console.log(err.message);
                        response.end();
                    }
                    else{
                        if(!result){
                            response.redirect("misAvisos",{errores: false});
                        }
                        else{
                            response.redirect("misAvisos");
                        }
                    }
            });
        }
    }

    getAvisoByText(query, callback) {
        this.avisoDAO.getAvisoByText(query,(err, result) => {
            if (err) {
                console.log(err.message);
                callback(false);
            }
            else if (!result) {
                console.log("no hay usuarios con ese nombre");
                callback(false);
            }
            else {
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });
    }

}

module.exports = AvisoService;