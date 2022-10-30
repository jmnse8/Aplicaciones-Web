const mysql = require('mysql');
const config = require("../config");

var pool;
module.exports = {
    getPool: () => (pool) ? pool : mysql.createPool(config.mysqlConfig)
};