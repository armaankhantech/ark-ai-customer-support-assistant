const { loadPdf } = require("./pdfLoader");
const { loadTxt } = require("./txtLoader");
const { loadMarkdown } = require("./markdownLoader");
const { loadWord } = require("./wordLoader");

module.exports = {
    loadPdf,
    loadTxt,
    loadMarkdown,
    loadWord
};