"use strict";

const {
  calculateTotalsPerCategory,
  getTop3Largest,
  getMonthlyAverages
} = require("../services/transactionService");

function formatMoney(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function printReport(transactions) {
  const totalsPerCategory = calculateTotalsPerCategory(transactions);
  const topTransactions = getTop3Largest(transactions);
  const monthlyAverages = getMonthlyAverages(transactions);

  console.log("\nTOTAL PER CATEGORY");

  Object.entries(totalsPerCategory).forEach(([category, total]) => {
    console.log(`${category}: ${formatMoney(total)}`);
  });

  console.log("\nTOP 3 LARGEST TRANSACTIONS");

  topTransactions.forEach((transaction, index) => {
    console.log(
      `${index + 1}. ${transaction.id} | ${transaction.category} | ${formatMoney(
        transaction.amount,
      )} | ${transaction.date}`,
    );
  });

  console.log("\nMONTHLY AVERAGES");

  monthlyAverages.forEach(({ month, average }) => {
    console.log(`${month}: ${formatMoney(average)}`);
  });
}

module.exports = {
  printReport,
};