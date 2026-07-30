const fs = require("fs/promises");
const path = require("path");
const pdf = require("pdf-parse");
const AppError = require("../../errors/AppError");
class PdfLoader {

    async load(filePath) {

        try {

            const buffer = await fs.readFile(filePath);

            const data = await pdf(buffer);

            return {
                fileName: path.basename(filePath),
                fileType: "pdf",
                pageCount: data.numpages,
                text: data.text.trim()
            };

        } catch (error) {

             throw new AppError(
             "Failed to load PDF.",
              500,
             "PDF_LOAD_FAILED"
            );

        }

    }

}

module.exports = {
    loadPdf
};