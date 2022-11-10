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
                connection.query("SELECT tar.idTarea, tar.texto, usu_tar.hecho, eti.texto FROM (((aw_tareas_usuarios as usu JOIN aw_tareas_user_tarea as usu_tar ON usu.idUser = usu_tar.idUser) JOIN aw_tareas_tareas as tar ON usu_tar.idTarea = tar.idTarea) JOIN aw_tareas_tareas_etiquetas as tar_eti ON tar.idTarea = tar_eti.idTarea) JOIN aw_tareas_etiquetas as eti ON tar_eti.idEtiqueta = eti.idEtiqueta WHERE usu_tar.hecho = true and usu.email = ?;",
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
                                let tareas = [], tag = [];
                                for (let it of rows) {
                                    console.log(it);
                                   if (!tareas[it.idTarea])
                                        tareas[it.idTarea] = {
                                            "id": it.idTarea,
                                            "text": it.text,
                                            "done": it.hecho,
                                            "tags": []
                                        };

                                    if (it.tag) tareas[it.id].tags.push(it.tag);

                                }

                                rows = tareas;
                                callback(null, rows);
                            }
                        }
                    });
            }
        });
    }
    /*
    insertTask(email, task, callback) {
        
    }
    */
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
    
    deleteCompleted(email, callback) {  
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error("Error de conexión a la base de datos"));
            } else {
                connection.query("DELETE FROM aw_tareas_tareas t JOIN aw_tareas_user_tarea tu ON t.IdTarea = tu.IdTarea JOIN aw_tareas_usuarios u ON tu.IdUser = u.IdUser WHERE u.email=?",
                    email,
                    function (err, result) {
                        connection.release(); 
                        if (err) {
                            callback(new Error("Error de acceso a la base de datos"));
                        }
                    });
            }
        }); 
    }
}

module.exports = DAOTasks;