const config = require("./chunkConfig");

class TextChunker {

    chunk(document) {

        if (!document || !document.text) {
            throw new Error("Invalid document supplied for chunking.");
        }

        const { chunkSize, chunkOverlap } = config;

        const chunks = [];  

        const words = document.text.split(/\s+/);

        let currentChunk = [];
        let currentLength = 0;


        for (const word of words) {

    // +1 accounts for the space between words
    if (currentLength + word.length + 1 <= chunkSize) {

        currentChunk.push(word);
        currentLength += word.length + 1;

    } else {

        const content = currentChunk.join(" ");

        chunks.push({
            id: chunks.length + 1,
            content,
            metadata: {
                source: document.fileName,
                fileType: document.fileType,
                chunkIndex: chunks.length + 1,
                length: content.length
            }
        });

        // ---------- Build Overlap ----------

        const overlapWords = [];

        let overlapLength = 0;

        for (let i = currentChunk.length - 1; i >= 0; i--) {

            overlapWords.unshift(currentChunk[i]);

            overlapLength += currentChunk[i].length + 1;

            if (overlapLength >= chunkOverlap) {
                break;
            }

        }

        currentChunk = [...overlapWords, word];

        currentLength =
            overlapWords.join(" ").length +
            word.length +
            1;

    }

}
     
        if (currentChunk.length > 0) {

    const content = currentChunk.join(" ");

    chunks.push({

        id: chunks.length + 1,

        content,

        metadata: {

            source: document.fileName,

            fileType: document.fileType,

            chunkIndex: chunks.length + 1,

            length: content.length

        }

    });

        }

        return chunks;

    }
       
    

}
module.exports = new TextChunker();