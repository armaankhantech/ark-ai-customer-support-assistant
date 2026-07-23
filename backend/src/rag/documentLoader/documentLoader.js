const path = require("path");

const pdfLoader = require("./pdfLoader");
const txtLoader = require("./txtLoader");
const markdownLoader = require("./markdownLoader");
const wordLoader = require("./wordLoader");

class DocumentLoader {

    async load(filePath) {

        const extension = path.extname(filePath).toLowerCase();

        switch (extension) {

            case ".pdf":
                return pdfLoader.load(filePath);

            case ".txt":
                return txtLoader.load(filePath);

            case ".md":
                return markdownLoader.load(filePath);

            case ".docx":
                return wordLoader.load(filePath);

            default:
                throw new Error(`Unsupported file type: ${extension}`);
        }
    }
}

module.exports = new DocumentLoader();