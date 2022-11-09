"use strict"

class AvisoDAO {
    constructor() {
        this.pool = require('../data/pool').getPool();
    }

    /*
    INSERT INTO `ucm_aw_cau_avi_avisos` ( `usu_id`, `nEmpleado`, `tema`, `comentarios`, `observaciones`, `activo`, `categoria`, `fecha`) 
    VALUES (9, NULL, 'certificado digital de persona fisica', '', 'ayudaaaa', 1, 'sugerencia', '2008-01-02 01:01:01.000001');
    */

    getMisAvisos(userId, callback) {
        console.log(userId);
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(new Error("Error en la conexión a la base de datos"));
            }
            else {
                const sql = "SELECT * FROM ucm_aw_cau_avi_avisos WHERE usu_id = ? and activo = true";
                connection.query(sql, [userId],
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
        })
    }

}

module.exports = AvisoDAO;