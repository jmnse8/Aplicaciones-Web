"use strict"

class UserDAO {
    constructor(){
        this.pool = require('../data/pool').getPool();
    }

    getUser(email, callback){
        this.pool.getConnection((err, connection)=>{
            if(err){
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else{
                const sql = "SELECT * FROM ucm_aw_cau_usu_usuarios WHERE email = ?";
                connection.query(sql, email, 
                    function(err, row){
                        connection.release();
                        if(err){
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else{
                           if(row.length === 0){
                                callback(null, false);
                            }
                            else{
                                let json = JSON.parse(JSON.stringify(row));
                                let iden = json[0];
                                callback(null, iden);
                            }
                        }
                    })
            }
        })
    }

    newUser(nombre, email, contraseña, imagen, perfil, nEmpleado, callback){
        this.pool.getConnection((err, connection)=>{
            if(err){
                callback(new Error("Error en la conexión a la base de datos"));
            }else{
                const sql = "INSERT INTO ucm_aw_cau_usu_usuarios (nombre, email, contraseña, imagen, activo, perfil, nEmpleado) VALUES (?, ?, ?, ?, ?, ?, ?)";
                connection.query(sql, [nombre, email, contraseña, imagen, true, perfil, nEmpleado], 
                    function(err, result){
                        connection.release();
                        if(err){
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else{
                            callback(result);
                        }
                    })
            }
        })
    }
}

module.exports = UserDAO;