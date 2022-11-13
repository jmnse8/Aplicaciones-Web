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
        this.avisoDAO.getMisAvisos(user.id, (err, result) => {
            if(err){
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if(!result){
                console.log("no existe ese usuario");
                callback(false);
                //response.render("login", {errores: false});
            }
            else{
                //console.log('SA-------');
                //console.log(result);
                callback(result);
            }
            //return [];
        });
        
    }

    newAviso(request, response) {
        const errors = validationResult(request);

        if(errors.isEmpty()){//new Date().toISOString().slice(0, 19).replace('T', ' ')
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
            this.avisoDAO.newAviso(usuario.id, tema, 
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

}

module.exports = AvisoService;