const axios = require("axios");
const pool = require("../database/postgres");

const { buildContext } = require("./contextEngineService");
const { buildPrompt } = require("../prompts/promptBuilder");
const { SYSTEM_PROMPT } = require("../prompts/systemPrompt");

const env = require("../config/env");
const directResponses = require("../rules");
const logger = require("../utils/logger");

const OLLAMA_URL =
    env.OLLAMA_URL || "http://localhost:11434";

const OLLAMA_MODEL =
    env.OLLAMA_MODEL || "llama3.2:3b";


/* ============================================================
   STREAMING CHAT
   ============================================================ */

async function streamChat(sessionId, userMessage, onChunk) {

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

        await pool.query(
            `
            INSERT INTO messages (session_id, message, role)
            VALUES ($1, $2, 'user')
            `,
            [sessionId, userMessage]
        );


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
            userMessage
        );

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
           6. Ollama Streaming
        ---------------------------------------------------- */

        const ollamaStart = Date.now();

        const response = await axios.post(
            `${OLLAMA_URL}/api/generate`,
            {
                model: OLLAMA_MODEL,
                prompt,
                stream: true,

                keep_alive: "30m",

                options: {
                    temperature: 0.2,
                    num_predict: 180,
                    top_p: 0.8,
                    top_k: 20,
                    repeat_penalty: 1.1
                }
            },
            {
                responseType: "stream",
                timeout: 120000
            }
        );


        /* ----------------------------------------------------
           7. Receive Ollama chunks
        ---------------------------------------------------- */

        let fullReply = "";
        let buffer = "";

        response.data.on("data", (chunk) => {

            buffer += chunk.toString();

            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {

                if (!line.trim()) {
                    continue;
                }

                try {

                    const data = JSON.parse(line);

                    if (data.response) {

                        fullReply += data.response;

                        if (onChunk) {
                            onChunk(data.response);
                        }

                    }

                    if (data.done) {

                        logger.info(
                            "Ollama streaming completed",
                            {
                                duration:
                                    `${Date.now() - ollamaStart} ms`
                            }
                        );

                    }

                } catch (error) {

                    logger.warn(
                        "Could not parse Ollama stream chunk",
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
                    timeout: 120000
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