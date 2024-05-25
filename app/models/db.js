const sql = require('mssql');
var log4js = require("../config/logger");
var logger = log4js.getLogger();

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    requestTimeout: 300000,
    port: 1433,
    synchronize: true,
    trustServerCertificate: false,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 100000

    },
    options: {
        encrypt: (process.env.IS_ENCRYPT === 'true') // for azure 
        // encrypt: true, // for azure 
    }
}

sql.connect(sqlConfig).then(pool => {
    console.log("MSSql DB Connected To : -----  ", process.env.DB_NAME);
    logger.info('MSSql DB Connected To', process.env.DB_NAME);
}).catch(function (err) {
    console.log("MSSql DB Connect Error *** ", err);
});

module.exports = sql;

