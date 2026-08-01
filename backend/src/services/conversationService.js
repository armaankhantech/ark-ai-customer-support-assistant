const pool = require("../database/postgres");

async function deleteConversation(sessionId) {
    const result = await pool.query(
        "DELETE FROM messages WHERE session_id = $1",
        [sessionId]
    );

    return {
        deleted: result.rowCount
    };
}

async function getConversations() {
    const result = await pool.query(`
        SELECT
            m.session_id,
            (
                SELECT message
                FROM messages first_msg
                WHERE first_msg.session_id = m.session_id
                  AND first_msg.role = 'user'
                ORDER BY first_msg.created_at ASC
                LIMIT 1
            ) AS title,
            MAX(m.created_at) AS updated_at,
            COUNT(*) AS message_count
        FROM messages m
        GROUP BY m.session_id
        ORDER BY MAX(m.created_at) DESC
    `);

    return result.rows.map(row => ({
        sessionId: row.session_id,

        title: row.title
            ? row.title.length > 50
                ? row.title.slice(0, 50) + "..."
                : row.title
            : "New conversation",

        updatedAt: row.updated_at,

        messageCount: Number(row.message_count)
    }));
}

module.exports = {
    deleteConversation,
    getConversations
};