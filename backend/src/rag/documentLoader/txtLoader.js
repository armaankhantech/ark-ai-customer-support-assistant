const fs = require("fs/promises");

async function loadTxt(filePath) {

    try {

        const text = await fs.readFile(filePath, "utf8");

        return text;

    } catch (error) {

        throw new Error(`Failed to load TXT file: ${error.message}`);

    }

}

module.exports = {
    loadTxt
};