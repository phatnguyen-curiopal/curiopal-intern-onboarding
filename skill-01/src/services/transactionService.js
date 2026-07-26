"use strict";

function calculateTotalsPerCategory(transactions) {
  let totals = {};

  transactions.forEach((trans) => {
    if (trans.category in totals) {
      totals[trans.category] += trans.amount;
    } else {
      totals[trans.category] = trans.amount;
    }
  });

  return totals;
}

function getTop3Largest(transactions) {
  return [...transactions]
    .sort((a, b) => {
      return b.amount - a.amount;
    })
    .slice(0, 3);
}

function getMonthlyAverages(transactions) {
  const monthlyTotals = {};
  transactions.forEach((trans) => {
    const month = trans.date.slice(0, 7);

    if (month in monthlyTotals) {
      monthlyTotals[month].count += 1;
      monthlyTotals[month].total += trans.amount;
    } else {
      monthlyTotals[month] = {
        count: 1,
        total: trans.amount,
      };
    }
  });

  const monthlyAverages = Object.entries(monthlyTotals).map(
    ([month, value]) => {
      return {
        month,
        average: value.total / value.count,
      };
    },
  );

  return monthlyAverages;
}

module.exports = {
  calculateTotalsPerCategory,
  getTop3Largest,
  getMonthlyAverages
};