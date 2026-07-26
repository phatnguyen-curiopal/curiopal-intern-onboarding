"use strict";

const { validateTransactions } = require("../utils/validator");

async function fetchData (url) {
    let response;

    try {
        response = await fetch(url);
    } catch {
        throw new Error("Network failure: could not connect to the server.");
    }

    if( !response.ok ) {
        throw new Error(
            `Server returned HTTP ${response.status} ${response.statusText}.`
        );
    }

    let textResponse;
    try {
        textREsponse = response.text;
    } catch {
        throw new Error("Could not read the server response.");
    }

    let data;
    try {
        data = JSON.parse(textResponse);
    } catch {
        throw new Error("The server returned invalid JSON.");
    }

    return validateTransactions(data);
}

module.exports = {
    fetchData,
};