
const os = require("os");
const axios = require("axios");

const pool = require("../database/postgres");
const env = require("../config/env");

async function checkDatabase() {

    try {

        await pool.query("SELECT 1");

        return "connected";

    } catch {

        return "disconnected";

    }

}

async function checkOllama() {

    try {

        await axios.get(`${env.OLLAMA_URL}/api/tags`, {
            timeout: 3000
        });

        return "online";

    } catch {

        return "offline";

    }

}

async function checkN8n() {

    try {

        await axios.get(env.N8N_WEBHOOK_URL, {
            timeout: 3000
        });

        return "reachable";

    } catch {

        return "unreachable";

    }

}

async function getHealthStatus() {

const [database, ollama, n8n] = await Promise.all([
    checkDatabase(),
    checkOllama(),
    checkN8n()
]);

    let status = "healthy";

    if (
        database !== "connected" ||
        ollama !== "online" ||
        n8n !== "reachable"
    ) {

        status = "degraded";

    }

    return {

        success: true,

        data: {

            status,

            database,

            ollama,

            n8n,

            uptime: process.uptime(),

            timestamp: new Date().toISOString(),

            version: "1.0.0",

            environment: process.env.NODE_ENV || "development",

            hostname: os.hostname()

        }

    };

}

module.exports = {

    getHealthStatus

};