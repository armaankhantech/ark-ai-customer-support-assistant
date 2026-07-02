const express = require("express");
const cors = require("cors");
const axios = require("axios");
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

        console.log("User:", userMessage);

        const response = await axios.post(WEBHOOK_URL, {
            message: userMessage
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