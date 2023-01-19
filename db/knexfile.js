require('dotenv').config();

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: process.env.DB_PASS,
        database: 'lep_stock'
    }
});

module.exports = knex;