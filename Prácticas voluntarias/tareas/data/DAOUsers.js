"use strict";

class DAOUsers {
    constructor(pool) {
        this.pool = pool;
    }

    isUserCorrect(correo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {
                connection.query("SELECT * FROM user WHERE email = ? AND password = ?",
                    [email, password],
                    function (err, rows) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (rows.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    });
            }
        }
        );
    }

    
    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, con) {
            if (err)
                callback(err);
            else {
                con.query("SELECT Imagen FROM aw_tareas_usuarios WHERE email = ?",
                 [email], function (err, result) {
                    con.release();
                    if (err) {
                        callback(err);
                    } else
                        // Comprobar si existe una persona con el Id dado.
                        if (result.length === 0)
                            callback("No existe");
                        else
                            callback(null, result[0].Imagen);
                });
            }
        });
    }

}
module.exports = DAOUsers;

/* daoUser.isUserCorrect("usuario@ucm.es", "mipass", cb_isUserCorrect);

function cb_isUserCorrect(err, result) {
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
} */