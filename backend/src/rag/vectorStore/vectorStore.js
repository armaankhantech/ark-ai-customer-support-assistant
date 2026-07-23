const pool = require("../../database/postgres");
const config = require("./vectorConfig");

class VectorStore {

    /**
     * Store a single chunk and its embedding
     */
    async storeChunk(chunk, embedding) {

        const sql = `
            INSERT INTO ${config.tableName}
            (
                source,
                chunk_index,
                content,
                embedding
            )
            VALUES
            ($1, $2, $3, $4)
        `;

        // Convert JavaScript array into pgvector format
        const vector = `[${embedding.join(",")}]`;

        await pool.query(sql, [
            chunk.metadata.source,
            chunk.metadata.chunkIndex,
            chunk.content,
            vector
        ]);

    }

    /**
     * Store multiple chunks and embeddings
     */
    async storeChunks(chunks, embeddings) {

        if (chunks.length !== embeddings.length) {
            throw new Error("Chunks and embeddings count do not match.");
        }

        for (let i = 0; i < chunks.length; i++) {

            await this.storeChunk(
                chunks[i],
                embeddings[i]
            );

        }

    }

}

module.exports = new VectorStore();