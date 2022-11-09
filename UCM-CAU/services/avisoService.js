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

}

module.exports = AvisoService;