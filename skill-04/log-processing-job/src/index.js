const { error } = require("console");
const fs = require("fs/promises");
const path = require("path");

//function for getting file entries
async function readLogFolder (folderPath) {
    let entries;
    try {
        entries = await fs.readdir(folderPath, {
            withFileTypes: true,
        });
    } catch (err) {
        throw new Error(`Error reading foler: ${err.message}`);
    }  

    const filePaths = [];
    for (entry of entries) {
        if (!entry.isFile() || path.extname(entry.name) != ".log") {
            continue;
        }

        filePaths.push(path.join(folderPath, entry.name));
    }

    return filePaths;
}


//Only log lines contain an error
async function extractErrorLines(filePath) {
    let lines;
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        lines = content.split(/\r?\n/);
    } catch (err) {
        throw new Error (`Cannot read file ${filePath}: ${err.message}`);
    }

    return lines.filter ((line) => {
        return line.includes("ERROR");
    })
}

async function getErrorsPerFile (filePaths) {
    const errorsPerFile = {};

    for (filePath of filePaths) {
        const errorLines = await extractErrorLines(filePath);
        errorsPerFile[path.basename(filePath)] = errorLines.length;
    }

    console.log("Errors per file: ", errorsPerFile);
    return errorsPerFile;
}


async function buildReport () {

}

async function main () {
    const folderPath = process.env.FOLDER_PATH;
    const outputPath = process.env.OUTPUT_PATH;
    
    console.log(folderPath);
    try {
        const filePaths = await readLogFolder(folderPath);
        await getErrorsPerFile(filePaths);
    } catch (err) {
        console.log(err.message);
        return 1;
    }
}

main();

