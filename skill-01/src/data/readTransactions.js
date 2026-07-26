"use strict";

const fs = require("node:fs/promises");
const { validateTransactions } = require("../utils/validator");

async function readTransactionsFromFile(filePath) {
  let content;

  try {
    content = await fs.readFile(filePath);
  } catch (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }

  let data;

  try {
    data = JSON.parse(content);
  } catch (err) {
    throw new Error(`Error reading file: ${err.message}`);
  }

  return validateTransactions(data);
}

module.exports = {
  readTransactionsFromFile,
};
