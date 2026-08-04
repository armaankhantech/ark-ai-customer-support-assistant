const pool = require("../database/postgres");
const logger = require("../utils/logger");

async function getConversationMemory(sessionId) {

    try {

        const result = await pool.query(
            `
            SELECT summary
            FROM conversation_summaries
            WHERE session_id = $1
            LIMIT 1
            `,
            [sessionId]
        );

        if (result.rows.length === 0) {

            return "";

        }

        return result.rows[0].summary;

    }

    catch (error) {

        logger.error("Failed to load conversation memory", {
            error: error.message
        });

        return "";

    }

}

module.exports = {

    getConversationMemory

};