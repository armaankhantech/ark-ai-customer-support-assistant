const express = require("express");
const cors = require("cors");
const axios = require("axios");
const companyInfo = require("./companyInfo");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

const WEBHOOK_URL =
    "https://rinse-upside-oyster.ngrok-free.dev/webhook/ark-support";

app.get("/", (req, res) => {
    res.send("Backend Running");
});

app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;
        const sessionId = req.body.sessionId;

        console.log("==================================");
        console.log("Session ID:", sessionId);
        console.log("User:", userMessage);
        console.log("==================================");

       const response = await axios.post(WEBHOOK_URL, {
        sessionId: sessionId,
        message: userMessage,
        company: companyInfo
 }); 

        console.log("n8n Response:", response.data);

        res.json({
            reply: response.data.ai_response
        });

    } catch (error) {

        console.error("Error calling n8n:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({
            reply: "Something went wrong."
        });

    }

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});