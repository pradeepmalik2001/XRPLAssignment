const xrpl = require("xrpl");
const Wallet = xrpl.Wallet;
const Client = xrpl.Client;
const NFTokenMintFlags = xrpl.NFTokenMintFlags;
const convertStringToHex = xrpl.convertStringToHex;

async function mintNFT() {
  try {
    let wallet = Wallet.fromSeed("sEd7UmHKtktQRA8ejP9RWmDiXo7J76P");

    let client = new Client("wss://s.altnet.rippletest.net/");

    wallet.sign;
    await client.connect();

    let nftMint = {
      Account: wallet.classicAddress,
      NFTokenTaxon: 1,
      TransactionType: "NFTokenMint",
      URI: convertStringToHex(
        //   "https://ipfs.io/ipfs/QmShd2CeTEH2QVnKx2YejkZUP3FLZLLusdhLeMiCFSjYeG?filename=nft.jpg"
        "https://ipfs.io/ipfs/QmfNZhEJd9KKWaetcZdcMxSgzQSRf7kzkNUgXVPZMeQG7b?filename=camera.jpg"
      ),
      Flags: NFTokenMintFlags.tfTransferable,
    };

    let signedTrx = wallet.sign(nftMint);
    console.log(signedTrx);

    let submittedTrx = await client.submit(nftMint, {
      autofill: true,
      wallet: wallet,
    });
    console.log(submittedTrx);
  } catch (err) {
    console.log(err);
  }
}

mintNFT();
