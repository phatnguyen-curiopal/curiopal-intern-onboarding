"use strict";

const requiredFields = ["id", "category", "amount", "date"];
function validateTransaction(transaction, index) {
  if (transaction === null || typeof transaction !== "object") {
    throw new Error(`Transaction at index ${index} must be an object`);
  }

  const missingFields = requiredFields.filter((field) => {
    transaction[field] === null ||
      transaction[field] === undefined ||
      transaction[field] == "";
  });

  if (missingFields.length >= 1) {
    throw new Error(
      `Object at index ${index} has missing fields: ${missingFields}`,
    );
  }

  if (isNaN(transaction.amount)) {
    throw new Error(`Object at index ${index} has invalid amount`);
  }

  if (isNaN(new Date(transaction.date).getTime())) {
    throw new Error(`Object at index ${index} has invalid date`);
  }

  return transaction;
};

function validateTransactions(data) {
  if (!Array.isArray(data)) {
    throw new Error("JSON data must be an array of transactions.");
  }

  return data.map(validateTransaction);
}

module.exports = {
  validateTransactions,
};