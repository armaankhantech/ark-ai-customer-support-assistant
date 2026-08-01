const pool = require("../database/postgres");

async function getHistory(sessionId) {

    const query = `
        SELECT
            role,
            message,
            created_at
        FROM messages
        WHERE session_id = $1
        ORDER BY created_at ASC, id ASC;
        
    `;

    const result = await pool.query(query, [sessionId]);

    return result.rows;

}

module.exports = {
    getHistory
};