const requiredVariables = [
    "N8N_WEBHOOK_URL",
    "N8N_MEMORY_WEBHOOK_URL",
    "POSTGRES_HOST",
    "POSTGRES_USER",
    "POSTGRES_PASSWORD",
    "POSTGRES_DB",
    "GROQ_API_KEY"
];
const missingVariables = requiredVariables.filter(
    (variable) => !process.env[variable]
);


if (missingVariables.length > 0) {

    console.error("\n❌ Missing required environment variables:\n");

    missingVariables.forEach((variable) => {
        console.error(`- ${variable}`);
    });

    console.error("\nPlease check your .env file.\n");

    process.exit(1);

}

module.exports = Object.freeze({

    PORT: process.env.PORT || 3000,

    NODE_ENV: process.env.NODE_ENV || "development",

    RATE_LIMIT_WINDOW_MS:
        Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,

    RATE_LIMIT_MAX_REQUESTS:
        Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 30,

    N8N_WEBHOOK_URL:
        process.env.N8N_WEBHOOK_URL,

    N8N_MEMORY_WEBHOOK_URL:
        process.env.N8N_MEMORY_WEBHOOK_URL,

    POSTGRES_HOST:
        process.env.POSTGRES_HOST,

    POSTGRES_USER:
        process.env.POSTGRES_USER,

    POSTGRES_PASSWORD:
        process.env.POSTGRES_PASSWORD,

    POSTGRES_DB:
        process.env.POSTGRES_DB,

    GROQ_API_KEY:
        process.env.GROQ_API_KEY,

    GROQ_MODEL:
        process.env.GROQ_MODEL ||
        "llama-3.3-70b-versatile",

    GROQ_TIMEOUT_MS:
        Number(process.env.GROQ_TIMEOUT_MS) ||
        120000,

    N8N_TIMEOUT_MS:
        Number(process.env.N8N_TIMEOUT_MS) ||
        120000,

    N8N_MEMORY_TIMEOUT_MS:
        Number(process.env.N8N_MEMORY_TIMEOUT_MS) ||
        5000

});