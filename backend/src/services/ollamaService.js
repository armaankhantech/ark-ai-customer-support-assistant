const axios = require("axios");
const pool = require("../database/postgres");

const { buildContext } = require("./contextEngineService");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");
const memoryService = require("./automationService");
const env = require("../config/env");
const directResponses = require("../rules");
const logger = require("../utils/logger");

const GROQ_URL =
    "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL =
    env.GROQ_MODEL || "llama-3.3-70b-versatile";


/* ============================================================
   STREAMING CHAT
   ============================================================ */

async function streamChat(sessionId, userMessage, onChunk) {

    console.log("\n================ STREAM CHAT ENTERED ================");
    console.log("SESSION ID RECEIVED:", sessionId);
    console.log("USER MESSAGE RECEIVED:", userMessage);
    console.log("=====================================================\n");

    const totalStart = Date.now();

    try {

        /* ----------------------------------------------------
           1. Validate session
        ---------------------------------------------------- */

        if (!sessionId) {
            throw new Error("Session ID is missing");
        }

        if (!userMessage || !userMessage.trim()) {
            throw new Error("User message is empty");
        }


        /* ----------------------------------------------------
           2. Save USER message immediately
        ---------------------------------------------------- */

const userInsert = await pool.query(
    `
    INSERT INTO messages (session_id, message, role)
    VALUES ($1, $2, 'user')
    RETURNING id, session_id, role
    `,
    [sessionId, userMessage]
);

console.log("🔥 USER MESSAGE INSERTED:", userInsert.rows[0]);
  const assistantInsert = await pool.query(
    `
    INSERT INTO messages (session_id, message, role)
    VALUES ($1, $2, 'assistant')
    RETURNING id, session_id, role
    `,
    [sessionId, fullReply]
);

console.log("🔥 ASSISTANT MESSAGE INSERTED:", assistantInsert.rows[0]);
const verifyInsert = await pool.query(
    `
    SELECT id, session_id, role, message
    FROM messages
    WHERE session_id = $1
    ORDER BY id DESC
    LIMIT 1
    `,
    [sessionId]
);

console.log("✅ DB VERIFICATION:", verifyInsert.rows);
        /* ----------------------------------------------------
           3. Direct Response Engine
        ---------------------------------------------------- */

        const directAnswer = directResponses.find(userMessage);

        if (directAnswer) {

            if (onChunk) {
                onChunk(directAnswer);
            }

            // Save AI response
            await pool.query(
                `
                INSERT INTO messages (session_id, message, role)
                VALUES ($1, $2, 'assistant')
                `,
                [sessionId, directAnswer]
            );

            return directAnswer;
        }


        /* ----------------------------------------------------
           4. Context Engine
        ---------------------------------------------------- */

        const contextStart = Date.now();

        const contextResult = await buildContext(
    1,
    sessionId,
    userMessage
);
console.log("\n========== STREAM MEMORY DEBUG ==========");
console.log("SESSION ID:", sessionId);
console.log(
    "MEMORY:",
    contextResult.conversationMemory || "NO MEMORY FOUND"
);
console.log("=========================================\n");

        logger.info("Context Engine completed", {
            duration: `${Date.now() - contextStart} ms`
        });


        /* ----------------------------------------------------
           5. Prompt Builder
        ---------------------------------------------------- */

        const promptStart = Date.now();

const prompt = buildPrompt({

    systemPrompt: SYSTEM_PROMPT,

    businessContext:
        contextResult.businessContext,

    documentContext:
        contextResult.documentContext,

    conversationMemory:
        contextResult.conversationMemory,

    conversationHistory: "",

    userMessage

});

        logger.info("Prompt built", {
            promptLength: prompt.length
        });

        logger.info("Prompt Builder completed", {
            duration: `${Date.now() - promptStart} ms`
        });


/* ----------------------------------------------------
   6. Groq Streaming
---------------------------------------------------- */

const groqStart = Date.now();

const response = await axios.post(
    GROQ_URL,
    {
        model: GROQ_MODEL,

        messages: [
            {
                role: "user",
                content: prompt
            }
        ],

        temperature: 0.2,

        max_tokens: 180,

        top_p: 0.8,

        stream: true
    },
    {
        headers: {
            "Authorization":
                `Bearer ${env.GROQ_API_KEY}`,

            "Content-Type":
                "application/json"
        },

        responseType: "stream",

        timeout: env.GROQ_TIMEOUT_MS
    }
);


/* ----------------------------------------------------
   7. Receive Groq chunks
---------------------------------------------------- */

let fullReply = "";
let buffer = "";

response.data.on("data", (chunk) => {

    buffer += chunk.toString();

    const lines = buffer.split("\n");

    buffer = lines.pop() || "";

    for (const line of lines) {

        const trimmed = line.trim();

        if (!trimmed) {
            continue;
        }

        if (trimmed === "data: [DONE]") {
            continue;
        }

        if (!trimmed.startsWith("data:")) {
            continue;
        }

        try {

            const jsonString =
                trimmed.replace(/^data:\s*/, "");

            const data =
                JSON.parse(jsonString);

            const content =
                data.choices?.[0]?.delta?.content;

            if (content) {

                fullReply += content;

                if (onChunk) {
                    onChunk(content);
                }

            }

        }

        catch (error) {

            logger.warn(
                "Could not parse Groq stream chunk",
                {
                    error: error.message
                }
            );

        }

    }

});


        /* ----------------------------------------------------
           8. Wait for Ollama stream to finish
        ---------------------------------------------------- */

        await new Promise((resolve, reject) => {

            response.data.on("end", resolve);

            response.data.on("error", reject);

        });


        /* ----------------------------------------------------
           9. SAVE AI RESPONSE
        ---------------------------------------------------- */

        if (fullReply.trim()) {

            await pool.query(
                `
                INSERT INTO messages (session_id, message, role)
                VALUES ($1, $2, 'assistant')
                `,
                [sessionId, fullReply]
            );

        }

        memoryService
    .sendConversation(
        sessionId,
        userMessage,
        fullReply
    );


        /* ----------------------------------------------------
           10. Logging
        ---------------------------------------------------- */

        logger.info("Chat streaming completed", {

            sessionId,

            totalDuration:
                `${Date.now() - totalStart} ms`,

            responseLength:
                fullReply.length

        });


        return fullReply;

    }

    catch (error) {

        logger.error(
            "Ollama Streaming Error",
            {
                sessionId,
                error: error.message
            }
        );

        throw error;

    }

}


/* ============================================================
   EXISTING NON-STREAMING CHAT
   ============================================================ */

async function chat(sessionId, userMessage) {

    try {

        const totalStart = Date.now();

        const directAnswer =
            directResponses.find(userMessage);

if (directAnswer) {

    // Save user message
    await pool.query(
        `
        INSERT INTO messages (session_id, message, role)
        VALUES ($1, $2, 'user')
        `,
        [sessionId, userMessage]
    );

    // Save AI response
    await pool.query(
        `
        INSERT INTO messages (session_id, message, role)
        VALUES ($1, $2, 'assistant')
        `,
        [sessionId, directAnswer]
    );

    return {
        success: true,
        data: {
            reply: directAnswer
        }
    };
}


        const contextStart = Date.now();

        const contextResult =
            await buildContext(
                1,
                userMessage
            );

        logger.info(
            "Context Engine completed",
            {
                duration:
                    `${Date.now() - contextStart} ms`
            }
        );


        const promptStart = Date.now();

        const prompt =
            buildPrompt({

                systemPrompt: SYSTEM_PROMPT,

                businessContext:
                    contextResult.businessContext,

                documentContext:
                    contextResult.documentContext,

                conversationHistory: "",

                userMessage

            });


        logger.info("Prompt built", {
            promptLength: prompt.length
        });


        logger.info(
            "Prompt Builder completed",
            {
                duration:
                    `${Date.now() - promptStart} ms`
            }
        );


        /*
         * Keep your existing n8n flow untouched
         * for now.
         */

        const response =
        console.log("===== N8N DEBUG =====");
        console.log("Webhook URL:", env.N8N_WEBHOOK_URL);
        console.log("Session:", sessionId);
        console.log("Message:", userMessage);
            await axios.post(
                env.N8N_WEBHOOK_URL,
                {
                    sessionId,
                    message: userMessage,
                    prompt,
                    intent:
                        contextResult.intent,
                    businessContext:
                        contextResult.businessContext,
                    documentContext:
                        contextResult.documentContext
                },
                {
                    timeout: env.N8N_TIMEOUT_MS
                }
            );


        logger.info(
            "n8n Workflow completed",
            {
                duration:
                    `${Date.now() - totalStart} ms`
            }
        );


        const reply =
            response.data.reply ||
            response.data.response ||
            response.data.ai_response ||
            response.data.output ||
            "";


        return {

            success: true,

            data: {
                reply
            }

        };

    }

    catch (error) {

        console.error(
            "Ollama Service Error:",
            error.message
        );

        throw error;

    }

}


/* ============================================================
   EXPORTS
   ============================================================ */

module.exports = {

    chat,
    streamChat

};