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
                                    if(!tareas.find(t => t.id === it.id)){
                                        let tarea = {
                                            id: it.id,
                                            text: it.texto,
                                            done: (it.done === 1) ? true : false,
                                            tags: []
                                        };
                                        tareas.push(tarea);
                                    }
                                    if(it.tags){
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

    }
    markTaskDone(idTask, callback) {

    }
    deleteCompleted(email, callback) {

    }
}

module.exports = DAOTasks;