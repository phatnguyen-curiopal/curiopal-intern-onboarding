"use strict";

const path = require("node:path");
const { fetchData } = require("./data/fetchDataFromUrl");
const { readTransactionsFromFile } = require("./data/readTransactions");
const { printReport } = require("./utils/formatter");

async function main() {

  // const inputPath = process.argv[2];

  // if (!inputPath) {
  //   console.error("Usage: node index.js <path-to-json-file>");
  //   process.exitCode = 1;
  //   return;
  // }

  // try {
  //   const absolutePath = path.resolve(inputPath);
  //   const transactions = await readTransactionsFromFile(absolutePath);

  //   printReport(transactions);
  // } catch (error) {
  //   console.error(`Error: ${error.message}`);
  //   process.exitCode = 1;
  // }

  const url = process.argv[2];
  if (!url) {
    console.error("No url specified");
    process.exitCode = 1;
    return;
  }

  try {
    const transactions = await fetchData(url);
    printReport(transactions);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exitCode = 1;
  }
}

main();
