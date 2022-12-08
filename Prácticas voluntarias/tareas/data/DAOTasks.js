"use strict";


class DAOTasks {
    constructor(pool) {
        this.pool = pool;
    }

    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            }
            else {//id, text, done y tags[]
                connection.query(
                    "SELECT tar.idTarea as id, tar.texto as texto, usu_tar.hecho as done, eti.texto as tags FROM (((aw_tareas_usuarios as usu JOIN aw_tareas_user_tarea as usu_tar ON usu.idUser = usu_tar.idUser) JOIN aw_tareas_tareas as tar ON usu_tar.idTarea = tar.idTarea) JOIN aw_tareas_tareas_etiquetas as tar_eti ON tar.idTarea = tar_eti.idTarea) JOIN aw_tareas_etiquetas as eti ON tar_eti.idEtiqueta = eti.idEtiqueta WHERE usu.email = ?;",
                    [email],
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
                                let tareas = [];
                                for (let it of rows) {
                                    if (!tareas.find(t => t.id === it.id)) {
                                        let tarea = {
                                            id: it.id,
                                            text: it.texto,
                                            done: (it.done === 1) ? true : false,
                                            tags: []
                                        };
                                        tareas.push(tarea);
                                    }
                                    if (it.tags) {
                                        tareas.find(t => t.id === it.id).tags.push(it.tags);
                                    }
                                }
                                callback(null, tareas);
                            }
                        }
                    });
            }
        }
        );
    }

    insertTask(email, task, callback) {
        getIdUser(email, this.pool, (idUser) => {
            insertTask(task.text, this.pool, (idTarea) => {
                joinUserTask(idUser, idTarea, false, this.pool, (bien) => {
                    insertTags(task.tags, this.pool, (idTags) => {
                            
                        idTags.forEach(t => joinTaskTag(idTarea, t,this.pool, (bien2) => {

                        }));
                        callback(null, true)
                    });
                });
            });
        });
    }

    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("UPDATE aw_tareas_user_tarea SET hecho = true WHERE IdTarea = ?",
                idTask,
                function (err, result) {
                    connection.release(); 
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                        else{
                            callback(null, true);
                        }
                });
            }
        });    
    }
    deleteCompleted (email, callback) {        
        getTareasUsuario(email, this.pool, (tareas) => {
            deleteTareasEtiquetas(tareas, this.pool, () => {
                deleteUsuariosTareas(email, this.pool, () => {
                    deleteEtiquetas(tareas, this.pool, () => {
                        deleteTareas(tareas, this.pool, () => {
                            callback(null, true);
                        })
                    })
                })
            })
        })  
    }

    /* deleteCompleted (email, callback) {        
        getTareasUsuario(email, this.pool, (tareas) => {
            deleteEtiquetas(tareas, this.pool, () => {
                deleteTareasEtiquetas(tareas, this.pool, () => {
                    deleteTareas(tareas, this.pool, () => {
                        deleteUsuariosTareas(email, this.pool, () => {
                            callback(null, true);
                        })
                    })
                })
            })
        })  
    } */
}

//------------------- FUNCIONES AUXILIARES PARA INSERTAR TAREAS -------------------//

function deleteEtiquetas(tareas, pool, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        } else {
            console.log(tareas);
            let interrogaciones = tareas.map(e => '?').join(',');
            let sql = "DELETE aw_tareas_etiquetas FROM aw_tareas_etiquetas WHERE IdEtiqueta IN (SELECT IdEtiqueta FROM aw_tareas_tareas_etiquetas WHERE IdTarea IN ( " + interrogaciones + ") )";
            console.log('------' + "DELETE aw_tareas_etiquetas FROM aw_tareas_etiquetas WHERE IdEtiqueta IN (SELECT IdEtiqueta FROM aw_tareas_tareas_etiquetas WHERE IdTarea IN ( " + interrogaciones + ") )")
            connection.query(sql ,
            [...tareas],
            function (err, result) {
            connection.release(); 
            if (err){
                callback(new Error("Error borrando tareas"));
                console.log(err);
            }
            else {
                console.log("DELETE ETIQUETAS")
                callback();
            }
            });
        }  
    });      
}

function deleteTareasEtiquetas(tareas, pool, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        } else {
            let interrogaciones = tareas.map(e => '?').join(',');
            connection.query("DELETE aw_tareas_tareas_etiquetas FROM aw_tareas_tareas_etiquetas WHERE IdTarea IN ( " + interrogaciones + " )",
            [...tareas],
            function (err, result) {
            connection.release(); 
            if (err){
                callback(new Error("Error borrando tareas"));
                console.log(err);
            }
            else {
                console.log("DELETE TAREAS-ETIQUETAS")
                callback();
            }
            });
        }
    });    
}

function deleteTareas(tareas, pool, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        } else {
            console.log(tareas);
            let interrogaciones = tareas.map(e => '?').join(',');
            connection.query("DELETE aw_tareas_tareas FROM aw_tareas_tareas WHERE IdTarea IN ( " + interrogaciones  + " )",
            [...tareas],
            function (err, result) {
            connection.release(); 
            if (err){
                callback(new Error("Error borrando tareas"));
                console.log(err);
            }
            else {
                console.log("DELETE TAREAS")
                callback();
            }
            });
        }
    });        
}

function deleteUsuariosTareas(email, pool, callback){
    getIdUser(email, pool, (idUser) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE aw_tareas_user_tarea FROM aw_tareas_user_tarea WHERE IdUser = ? and hecho = 1",
                [idUser],
                function (err, result) {
                connection.release(); 
                if (err)
                    callback(new Error("Error borrando usuarios-tareas"));
                else {
                    console.log("DELETE USUARIOS-TAREAS")
                    callback();
                }
                });
            }
        }); 
    });
}

function getTareasUsuario(email, pool, callback) {
    getIdUser(email, pool, (idUser) => {
        console.log("ID USER: ") //
        console.log(idUser) // 
        pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("SELECT IdTarea FROM aw_tareas_user_tarea WHERE IdUser = ? and hecho = 1 GROUP BY IdTarea HAVING COUNT(*)<=1;",
                [idUser],
                function (err, result) {
                connection.release(); 
                if (err)
                    callback(new Error("Error borrando usuarios-tareas"));
                else {
                    let tareas = []
                    let json = JSON.parse(JSON.stringify(result));
                    json.forEach(i => tareas.push(i.IdTarea));
                    callback(tareas);
                }
                });                    
            }
        });
    });
}

function getIdUser(email, pool, callback) {
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            connection.query(
                "SELECT IdUser from aw_tareas_usuarios where email = ?",
                [email],
                function (err, rows) {

                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(false);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(false); //no está el usuario con el email proporcionado
                        }
                        else {
                            let idUser = rows[0].IdUser;
                            callback(idUser);
                        }
                    }
                });
        }
    }
    );

}

function insertTask(texto, pool, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            connection.query(
                "INSERT INTO aw_tareas_tareas(texto) VALUES (?)",
                [texto],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(false);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(false); //no está el usuario con el email proporcionado
                        }
                        else {
                            //console.log(rows);
                            let idTarea = rows.insertId;
                            callback(idTarea);
                        }
                    }
                }
            );
        }
    });
}

function joinUserTask(idUser, idTarea, done, pool, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            connection.query(
                "INSERT INTO aw_tareas_user_tarea (IdUser,IdTarea,hecho) VALUES (?,?,?)",
                [idUser, idTarea, done],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(false);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(false); //no está el usuario con el email proporcionado
                        }
                        else {
                            //console.log(rows);
                            //let idTarea = rows[0].insertId;
                            callback(true);
                        }
                    }
                }
            );
        }
    });
}

function insertTags(tags, pool, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            let sql = "INSERT INTO aw_tareas_etiquetas (texto) VALUES ";
            for(let i = 0; i < tags.length; i++){
                sql += "(?";
                if( i < tags.length - 1) sql += "),";
                else sql += ")";
            }
            
            //console.log(sql);
            connection.query(
                sql,
                [...tags],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        console.error(err);
                        callback(false);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(false); //no está el usuario con el email proporcionado
                        }
                        else {
                            //console.log(rows);
                            let idTags = [];
                            let firstId = rows.insertId;
                            for(let i = 0; i < tags.length; i++){
                                idTags.push(firstId + i);
                            }
                            console.log(rows);
                            callback(idTags);
                        }
                    }
                }
            );
        }
    });
}

function joinTaskTag(idTask, idTag, pool, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(new Error("Error de conexión a la base de datos"));
        }
        else {
            connection.query(
                "INSERT INTO aw_tareas_tareas_etiquetas (idEtiqueta, idTarea) VALUES (?,?)",
                [idTag,idTask],
                function (err, rows) {
                    connection.release(); // devolver al pool la conexión
                    if (err) {
                        callback(false);
                    }
                    else {
                        if (rows.length === 0) {
                            callback(false); //no está el usuario con el email proporcionado
                        }
                        else {
                            //console.log(rows);
                            //let idTarea = rows[0].insertId;
                            callback(true);
                        }
                    }
                }
            );
        }
    });
}

module.exports = DAOTasks;