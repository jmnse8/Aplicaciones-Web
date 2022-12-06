"use strict"

class AvisoDAO {
    constructor() {
        this.pool = require('../data/pool').getPool();
    }

    /*
    INSERT INTO `ucm_aw_cau_avi_avisos` ( `usu_id`, `nEmpleado`, `tema`, `comentarios`, `observaciones`, `activo`, `categoria`, `fecha`) 
    VALUES (9, NULL, 'certificado digital de persona fisica', '', 'ayudaaaa', 1, 'sugerencia', '2008-01-02 01:01:01.000001');
    */

    getMisAvisos(identificacion, tecnico, callback) {
        //console.log(userId);
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                let sql;
                if(tecnico)
                    sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE nEmpleado = ? and activo = true";
                else
                    sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE usu_id = ? and activo = true";
                
                //const sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE usu_id = ? and activo = true";
                connection.query(sql, [identificacion],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let avisos = [];
                                //console.log('DAO-------');
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    //console.log(json.id);
                                    avisos.push(json);
                                });
                                
                                //console.log(row);
                                //console.log(avisos);
                                callback(null, avisos);
                            }
                        }
                    })
            }
        });
    }

    getAvisosEntrantes(callback) {
        //console.log(userId);
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE activo = true";
                connection.query(sql,
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let avisos = [];
                                //console.log('DAO-------');
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    //console.log(json.id);
                                    avisos.push(json);
                                });
                                
                                //console.log(row);
                                //console.log(avisos);
                                callback(null, avisos);
                            }
                        }
                    })
            }
        });
    }

    newAviso(userId, tema,  observaciones, categoria, fecha, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }            else {
                const sql = "INSERT INTO ucm_aw_cau_avi_avisos ( usu_id, nEmpleado, tema, comentarios, observaciones, activo, categoria, fecha) VALUES (?, NULL, ?, '', ?, 1, ?, ?);";
                connection.query(sql, [userId, tema,  observaciones, categoria, fecha],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    })
            }
        });
    };

    getAvisoByText(query,callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE observaciones LIKE ?";
                connection.query(sql,['%' + query + '%'],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let avisos = [];
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    avisos.push(json);
                                });
                                
                                callback(null, avisos);
                            }
                        }
                    })
            }
        });
    };

    getHistorico(identificacion, tecnico, callback) {

        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                let sql;
                if(tecnico)
                    sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE nEmpleado = ? and activo = false";
                else
                    sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE usu_id = ? and activo = false";
                connection.query(sql, [identificacion],
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                let avisos = [];
                                row.forEach(element => {
                                    let json = JSON.parse(JSON.stringify(element));
                                    avisos.push(json);
                                });
                                callback(null, avisos);
                            }
                        }
                    })
            }
        });
    }


    deleteAviso(comentarios, idAvi, callback) {
        //console.log(userId);
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "UPDATE ucm_aw_cau_avi_avisos SET activo = false, comentarios = ? WHERE Id = ?";
                connection.query(sql, [comentarios, idAvi] ,
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                callback(null, row);
                            }
                        }
                    })
            }
        });
    }

    asignaTecnico(nEmpleado, idAvi, callback){
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "UPDATE ucm_aw_cau_avi_avisos SET nEmpleado = ? WHERE Id = ?";
                connection.query(sql, [nEmpleado, idAvi] ,
                    function (err, row) {
                        connection.release();
                        if (err) {
                            callback(new Error("Error al acceso a la base de datos"));
                            console.log(err.stack);
                        }
                        else {
                            if (row.length === 0) {
                                callback(null, false);
                            }
                            else {
                                callback(null, true);
                            }
                        }
                    })
            }
        });
    }

}

module.exports = AvisoDAO;