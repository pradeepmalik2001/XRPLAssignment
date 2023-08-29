const keypairs = require("ripple-keypairs");

// Generate a new Testnet account
const keypair = keypairs.generateSeed();
const address = keypairs.deriveAddress(keypair);

console.log("Account Secret:", keypair);
console.log("Account Address:", address);
