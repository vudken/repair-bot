require('dotenv').config();

const config = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: process.env.PORT,
        user: 'root',
        password: process.env.DB_PASS,
        database: 'lep_stock'
    }
});

module.exports = config;