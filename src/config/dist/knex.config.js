"use strict";
exports.__esModule = true;
exports.knexConfig = void 0;
var path = require('path');
exports.knexConfig = {
    config: {
        client: 'pg',
        version: '13',
        connection: {
            host: process.env.DB_HOST,
            user: 'postgres',
            password: '123',
            database: 'nest',
            port: 5432
        },
        migrations: {
            directory: './migrations'
        }
    }
};
