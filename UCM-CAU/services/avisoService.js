"use strict"
const fs = require('fs');
const { check, validationResult } = require("express-validator");
const AvisoDAO = require("../data/avisoDAO");
const UserDAO = require("../data/userDAO");

class AvisoService {
    constructor() {
        this.userDAO = new UserDAO();
        this.avisoDAO = new AvisoDAO();
    }

    getMisAvisos(user, callback) {
        //const errors = validationResult(request);
        let identificacion = 0, tecnico = false;
        if(user.nEmpleado != null){
            tecnico = true;
            identificacion = user.nEmpleado;
        }
        else{
            identificacion = user.Id;
        }
        this.avisoDAO.getMisAvisos(identificacion, tecnico, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No tiene avisos");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });
    }

    getAvisosEntrantes(callback) {
        //const errors = validationResult(request);
        this.avisoDAO.getAvisosEntrantes((err, avisos) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!avisos) {
                console.log("No hay avisos");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                avisos.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                this.userDAO.getAllTecnicos((err, tecnicos) => {
                    if (err) {
                        console.log(err.message);
                        //response.end();
                        callback(false);
                    }
                    else if (!tecnicos) {
                        console.log("No hay avisos");
                        callback(false);
                        //response.render("login", {errores: false});
                    }
                    else {
                        callback(avisos, tecnicos);
                    }
                });
            }
        });
    }

    newAviso(request, response) {
        const errors = validationResult(request);

        if (errors.isEmpty()) {
            let fecha = new Date().toISOString();
            let usuario = request.session.usuario;

            let categoria = request.body.radio;
            let tema;
            if (categoria === 'felicitacion') {
                tema = request.body.fel;
            }
            else {
                tema = request.body.suginc;
            }
            this.avisoDAO.newAviso(usuario.Id, tema,
                request.body.observaciones, categoria, fecha,
                (err, result) => {
                    if (err) {
                        console.log(err.message);
                        response.end();
                    }
                    else {
                        if (!result) {
                            response.redirect("misAvisos", { errores: false });
                        }
                        else {
                            response.redirect("misAvisos");
                        }
                    }
                });
        }
    }

    getAvisoByText(query, callback) {
        this.avisoDAO.getAvisoByText(query, (err, result) => {
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

    getHistorico(user, callback) {

        let identificacion = 0, tecnico = false;
        if(user.nEmpleado != null){
            tecnico = true;
            identificacion = user.nEmpleado;
        }
        else{
            identificacion = user.Id;
        }

        this.avisoDAO.getHistorico(identificacion, tecnico, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No tiene avisos");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                result.forEach(element => {
                    element.fecha = element.fecha.slice(0, 19).replace('T', ' ');
                });
                callback(result);
            }
        });

    }

    deleteAviso(comentarios, idAvi, nombreTec, callback) {
        if(comentarios === '')
            comentarios = 'Este aviso ha sido eliminado por el técnico ' + nombreTec;
        else
            comentarios = 'Este aviso ha sido eliminado por el técnico ' + nombreTec +' debido a: ' + comentarios;
        this.avisoDAO.deleteAviso(comentarios, idAvi, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No existe el aviso");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(result);
            }
        });
    }

    asignarTecnico(nEmpleado, idAvi, callback){
        this.avisoDAO.asignaTecnico(nEmpleado, idAvi, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No existe el aviso");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(result);
            }
        });
    }

    responderAviso(comentarios, idAvi, callback) {
        
        this.avisoDAO.deleteAviso(comentarios, idAvi, (err, result) => {
            if (err) {
                console.log(err.message);
                //response.end();
                callback(false);
            }
            else if (!result) {
                console.log("No existe el aviso");
                callback(false);
                //response.render("login", {errores: false});
            }
            else {
                callback(result);
            }
        });
    }
}

module.exports = AvisoService;