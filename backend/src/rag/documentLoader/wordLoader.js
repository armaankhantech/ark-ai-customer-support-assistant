const AppError = require("../../errors/AppError");  

async function loadWord(filePath) {

    throw new AppError(
    "DOCX documents are not supported yet.",
    501,
    "DOCX_NOT_IMPLEMENTED"
);

}

module.exports = {
    loadWord
};