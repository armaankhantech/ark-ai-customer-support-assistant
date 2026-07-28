const fs = require("fs/promises");

async function loadMarkdown(filePath) {

    try {

        const text = await fs.readFile(filePath, "utf8");

        return text;

    } catch (error) {

        throw new Error(`Failed to load Markdown file: ${error.message}`);

    }

}

module.exports = {
    loadMarkdown
};