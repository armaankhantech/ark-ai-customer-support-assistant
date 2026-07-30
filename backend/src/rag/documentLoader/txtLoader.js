const fs = require("fs/promises");
const AppError = require("../../errors/AppError");  
async function loadTxt(filePath) {

    try {

        const text = await fs.readFile(filePath, "utf8");

        return text;

    } catch (error) {

        throw new AppError(
            "Failed to load TXT file.",
            500,
            "TXT_LOAD_FAILED"
        );

    }

}

module.exports = {
    loadTxt
};