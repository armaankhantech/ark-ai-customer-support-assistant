const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
    host: env.POSTGRES_HOST,
    user: env.POSTGRES_USER,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DB,
});

module.exports = pool;