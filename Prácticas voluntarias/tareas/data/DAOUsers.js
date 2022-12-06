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
                connection.query("SELECT * FROM aw_tareas_usuarios WHERE email = ?",
                    [correo],
                    function (err, row) {
                        connection.release(); // devolver al pool la conexión
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false); //no está el usuario con el password proporcionado
                            }
                            else {
                                let json = JSON.parse(JSON.stringify(row));
                                let user = json[0];
                                callback(null, user);
                            }
                        }
                    });
            }
        }
        );
    }

    newUser(email, contraseña, imagen, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            } else {
                const sql = "INSERT INTO aw_tareas_usuarios (email, password, img) VALUES (?, ?, ?)";
                connection.query(sql, [email, contraseña, imagen],
                    function (err, rows) {
                        connection.release();
                        if (err) {
                            console.log(err.stack);
                            callback(new Error("Error al acceso a la base de datos"));
                        }
                        else {
                            callback(null, rows);
                        }
                    })
            }
        })
    }

    
    getUserImage(id, callback) {
        this.pool.getConnection(function (err, con) {
            if (err)
                callback(err);
            else {
                con.query("SELECT img FROM aw_tareas_usuarios WHERE IdUser = ?",
                 [id], function (err, result) {
                    con.release();
                    if (err) {
                        callback(err);
                    } else
                        // Comprobar si existe una persona con el Id dado.
                        if (result.length === 0)
                            callback("No existe");
                        else
                            callback(null, result[0].img);
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