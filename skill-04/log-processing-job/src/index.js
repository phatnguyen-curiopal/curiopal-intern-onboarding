"use strict";

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
    for (const entry of entries) {
        if (!entry.isFile() || path.extname(entry.name) !== ".log") {
            continue;
        }

        filePaths.push(path.join(folderPath, entry.name));
    }

    return filePaths;
}


//Only return lines containing an error
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

    for (const filePath of filePaths) {
        let errorLines;
        try {
            errorLines = await extractErrorLines(filePath);
        } catch (err) {
            console.log(err.message);
            continue;
        }
        errorsPerFile[path.basename(filePath)] = errorLines.length;
    }

    console.log("Errors per file: ", errorsPerFile);
    return errorsPerFile;
}


async function getErrorsPerHour (filePaths) {
    let errorLines = []

    for(const filePath of filePaths) {
        let fileErrorLines;
        try {
            fileErrorLines = await extractErrorLines(filePath);
        } catch (err) {
            console.log(err.message);
            continue;
        }
        errorLines = [...errorLines, ...fileErrorLines];
    }
    console.log(errorLines.length);

    const errorsPerHour = {};

    errorLines.forEach( (line) => {
        const hour = line.slice(0, 13);
        if (hour in errorsPerHour) {
            errorsPerHour[hour] += 1;
        } else {
            errorsPerHour[hour] = 1;
        }
    })

    console.log(errorsPerHour);
    return errorsPerHour;
}

async function getTopErrorMessages(filePaths, nMessage) {
    let errorLines = []

    for(const filePath of filePaths) {
        let fileErrorLines;
        try {
            fileErrorLines = await extractErrorLines(filePath);
        } catch (err) {
            console.log(err.message);
            continue;
        }
        errorLines = [...errorLines, ...fileErrorLines];
    }
    console.log(errorLines.length);

    const topMessages = {};

    errorLines.forEach( (line) => {
        const message = line.slice(31, );
        if (message in topMessages) {
            topMessages[message] += 1;
        } else {
            topMessages[message] = 1;
        }
    })

    const topMessagesArray = Object.entries(topMessages).map( ([key, value]) => {
        return {
            message: key,
            count: value
        }
    })

    console.log(topMessagesArray.sort( (a, b) => {
        return b.count - a.count;
    }).slice(0, nMessage));

    return topMessagesArray.sort( (a, b) => {
        return b.count - a.count;
    }).slice(0, nMessage);
}

async function buildReport (errorsPerFile, errorsPerHour, topErrorMessages, outputPath) {
    try {
        const report = {
            errorsPerFile,
            errorsPerHour,
            topErrorMessages
        }
        const reportJson = JSON.stringify(report, null, 2);

        await fs.writeFile(outputPath, reportJson, "utf-8");
    } catch (err) {
        throw new Error(`Cannot write JSON file: ${err.message}`);
    }
}

async function main () {
    const folderPath = process.env.FOLDER_PATH;
    const outputPath = process.env.OUTPUT_PATH;

    if(!folderPath || !outputPath) {
        console.log("Missing folder or ouput path");
        return;
    }
    
    console.log(folderPath);
    try {
        const filePaths = await readLogFolder(folderPath);
        const errorsPerFile = await getErrorsPerFile(filePaths);
        const errorsPerHour = await getErrorsPerHour(filePaths);
        const topErrorMessages = await getTopErrorMessages(filePaths, 3);
        await buildReport(errorsPerFile, errorsPerHour, topErrorMessages, outputPath);
    } catch (err) {
        console.log(err.message);
        process.exitCode = 1;
    }
    process.exitCode = 0;
}

main();

