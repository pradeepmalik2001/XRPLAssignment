"use strict";

if (typeof module !== "undefined") {
  // Use var here because const/let are block-scoped to the if statement.
  var xrpl = require("xrpl");
}

const cc = require("five-bells-condition");
const crypto = require("crypto");
const seed1 = "sEd7jfWyNG6J71dEojB3W9YdHp2KCjy"; // Replace with your own seed
const seed2 = "sEd7jfWyNG6J71dEojB3W9YdHp2KCjz"; // Replace with another seed
const main = async () => {
  try {
    const preimageData = crypto.randomBytes(32);
    const myFulfillment = new cc.PreimageSha256();
    myFulfillment.setPreimage(preimageData);
    const conditionHex = myFulfillment
      .getConditionBinary()
      .toString("hex")
      .toUpperCase();

    console.log("Condition:", conditionHex);
    console.log(
      "Fulfillment:",
      myFulfillment.serializeBinary().toString("hex").toUpperCase()
    );
    // Connect -------------------------------------------------------------------
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // Prepare wallets for signing the transaction ---------------------------------
    const wallet1 = xrpl.Wallet.fromSeed(seed1);
    const wallet2 = xrpl.Wallet.fromSeed(seed2);
    console.log("Wallet 1 Address: ", wallet1.address);
    console.log("Wallet 2 Address: ", wallet2.address);

    // Set the escrow finish time --------------------------------------------------
    let finishAfter = new Date(new Date().getTime() / 1000 + 120); // 2 minutes from now
    finishAfter = new Date(finishAfter * 1000);
    console.log("This escrow will finish after: ", finishAfter);

    const escrowCreateTransaction = {
      TransactionType: "EscrowCreate",
      Account: wallet1.address,
      Destination: wallet2.address, // Destination can be any address you choose
      Amount: "6000000", // drops XRP
      DestinationTag: 2023,
      Condition: conditionHex,
      Fee: "12",
      FinishAfter: xrpl.isoTimeToRippleTime(finishAfter.toISOString()),
      SignersCount: 3, // Number of signatures required
      SignerEntries: [
        {
          SignerEntry: {
            Account: wallet1.address,
            SignerWeight: 1, // Weight of this signer (can be 1-255)
          },
        },
        {
          SignerEntry: {
            Account: wallet2.address,
            SignerWeight: 1, // Weight of this signer (can be 1-255)
          },
        },
      ],
    };

    xrpl.validate(escrowCreateTransaction);

    // Sign and submit the transaction --------------------------------------------
    console.log(
      "Signing and submitting the transaction:",
      JSON.stringify(escrowCreateTransaction, null, "\t"),
      "\n"
    );

    const response = await client.submitAndWait(escrowCreateTransaction, {
      wallet: wallet1, // You can use either wallet1 or wallet2 for signing
    });

    console.log(`Sequence number: ${response.result.Sequence}`);
    console.log(
      `Finished submitting! ${JSON.stringify(response.result, null, "\t")}`
    );

    await client.disconnect();
  } catch (error) {
    console.log(error);
  }
};

main();
