const {
    MAX_DOCUMENT_CONTEXT_LENGTH
} = require("../config/constants");
class ContextCompressor {

    compress(documentContext) {

        if (!documentContext) {
            return "";
        }

        

        // Split back into retrieved chunks
        const chunks = documentContext
            .split("\n\n")
            .map(chunk => chunk.trim())
            .filter(Boolean);

        const seen = new Set();
        const cleanedChunks = [];

        for (const chunk of chunks) {

            // Remove document metadata
            const cleaned = chunk
                .split("\n")
                .filter(line => {

                    const text = line.trim();

                    if (!text) return false;

                    if (/^chapter\s+\d+/i.test(text)) return false;
                    if (/^section\s+\d+/i.test(text)) return false;
                    if (/^page\s+\d+/i.test(text)) return false;

                    return true;

                })
                .join("\n")
                .trim();

            if (!cleaned) continue;

            if (seen.has(cleaned)) continue;

            seen.add(cleaned);

            cleanedChunks.push(cleaned);

        }

        // Keep complete chunks only
        let compressed = "";
        let currentLength = 0;

        for (const chunk of cleanedChunks) {

            if (currentLength + chunk.length >  MAX_DOCUMENT_CONTEXT_LENGTH) {
                break;
            }

            compressed += chunk + "\n\n";
            currentLength += chunk.length;

        }

        return compressed.trim();

    }

}

module.exports = new ContextCompressor();