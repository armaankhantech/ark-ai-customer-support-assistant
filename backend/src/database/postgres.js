
    const { Pool } = require("pg");
    const env = require("../config/env");

    const pool = new Pool({
        host: env.POSTGRES_HOST,
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
    });

    pool.query("SELECT current_database(), current_user, inet_server_addr(), inet_server_port()")
.then(res => {
    console.log("CONNECTED DATABASE:");
    console.table(res.rows);
})
.catch(console.error);
    module.exports = pool;