const path = require("path");

const { loadPdf } = require("./pdfLoader");
const { loadTxt } = require("./txtLoader");
const { loadMarkdown } = require("./markdownLoader");
const { loadWord } = require("./wordLoader");

class DocumentLoader {

    async load(filePath) {

        const extension = path.extname(filePath).toLowerCase();

        switch (extension) {

            case ".pdf":
                return await loadPdf(filePath);

            case ".txt":
                return await loadTxt(filePath);

            case ".md":
                return await loadMarkdown(filePath);

            case ".doc":
            case ".docx":
                return await loadWord(filePath);

            default:
                throw new Error(
                    `Unsupported document type: ${extension}`
                );

        }

    }

}

module.exports = new DocumentLoader();