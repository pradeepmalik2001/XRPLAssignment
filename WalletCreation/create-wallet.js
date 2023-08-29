const { Wallet, Client } = require("xrpl");

const ECDSA = require("xrpl/dist/npm/ECDSA");

async function createWallet() {
  let newWallet = Wallet.generate(ECDSA.ed25519);

  console.log(newWallet);
}

async function fundWallet() {
  // let wallet = Wallet.fromSeed("sEd716b5piTG9dvBmUMAyvcQiUXUcAK");

  let wallet = Wallet.fromSeed("sEd7UmHKtktQRA8ejP9RWmDiXo7J76P");

  let client = new Client("wss://s.altnet.rippletest.net/");

  await client.connect();

  console.log("are we connected? " + client.isConnected());

  let result = await client.fundWallet(wallet);

  console.log(result);
}

//createWallet();
fundWallet();
