const fs = require("fs/promises");
const AppError = require("../../errors/AppError");  
async function loadMarkdown(filePath) {

    try {

        const text = await fs.readFile(filePath, "utf8");

        return text;

    } catch (error) {

        throw new AppError(
            "Failed to load Markdown file.",
            500,
            "MARKDOWN_LOAD_FAILED"
        );

    }

}

module.exports = {
    loadMarkdown
};