const path = require("path");
const { loadPdf } = require("./pdfLoader");
const { loadTxt } = require("./txtLoader");
const { loadMarkdown } = require("./markdownLoader");
const { loadWord } = require("./wordLoader");
const AppError = require("../../errors/AppError");

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
                throw new AppError(
                    `Unsupported document type: ${extension}`,
                    400,
                    "UNSUPPORTED_DOCUMENT_TYPE"
                );

        }

    }

}

module.exports = new DocumentLoader();