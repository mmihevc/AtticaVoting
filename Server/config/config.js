/*
-------------------------------------------------------------------------
This is where you will input your Hedera account ID and private key if
you are hosting and wish the program to take this information automatically
rather then manually. Note: you must rename the file to config.js
-------------------------------------------------------------------------
 */

const hederaConfig = {
    "account": "0.0.6197",
    "key": "302e020100300506032b65700422042095053a9256c667ab0a4b56dd9938af16567636f2a7f91e63e159bbf7d9f0d5ae"
}

const dragonGlassConfig = {
    "XAPIKEY": "e1e33e7b-512e-3c1c-b00d-9cde96b3418f"
}

const securityConfig = {
    "pub": "./key.pub",
    "priv": "./key"
}

module.exports = {
    hederaConfig,
    dragonGlassConfig,
    securityConfig
};