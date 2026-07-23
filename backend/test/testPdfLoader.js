const path = require("path");
const pdfLoader = require("../src/rag/documentLoader/pdfLoader");

async function testPdfLoader() {

    try {

        const pdfPath = path.join(
            __dirname,
            "../knowledge/ARK_AI_Company.pdf"
        );

        const document = await pdfLoader.load(pdfPath);

        console.log("\n========== PDF LOADER TEST ==========\n");

        console.log("File Name :", document.fileName);
        console.log("File Type :", document.fileType);
        console.log("Pages     :", document.pageCount);
        console.log("Characters:", document.text.length);

        console.log("\n========== First 500 Characters ==========\n");

        console.log(document.text.substring(0, 500));

        console.log("\n==========================================\n");

    } catch (error) {

        console.error(error);

    }

}

testPdfLoader();