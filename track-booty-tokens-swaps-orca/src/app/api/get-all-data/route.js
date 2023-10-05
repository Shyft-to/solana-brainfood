import { ShyftSdk, Network } from "@shyft-to/js";
import { NextResponse } from "next/server";

const shyftClient = new ShyftSdk({
  apiKey: process.env.SHYFT_KEY,
  network: Network.Mainnet,
});

export const GET = async (req, res) => {
  try {
    const url = new URL(req.url);
    const protocol = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";
    const token = url.searchParams.get("address");
    const dateTime = url.searchParams.get("date_time");
    const endTime = reduceHours(dateTime,1);
   
    if (!protocol) throw new Error("INVALID_ADDRESS");
    if (!token) throw new Error("INVALID_TOKEN_ADDRESS");

    const firstTransaction = await getFirstTransactionsAfterTime(token, dateTime);
    console.log("First Transaction Received: ", firstTransaction);
    console.log("Getting Swap Transactions After that....");
    const transactions = await getSwapTransaction(token, firstTransaction, endTime);
    const orcaTransactions = getOrcaSwaps(transactions,protocol);
    console.log("Orca Swaps Received: ",orcaTransactions.length);
    const aggData = calculateAggData(orcaTransactions,token);
    
    return NextResponse.json({
      success: true,
      transactions: orcaTransactions,
      additional_data: aggData
    });
    
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      {
        status: 500,
      }
    );
  }
};

function reduceHours(date, hours) {
  date.setTime(date.getTime() - hours * 60 * 60 * 1000);

  return date;
}
async function getFirstTransactionsAfterTime(address, timestamp) {
  let firstTransactionSignature = "";
  let oldestTxnSignature = "";
  const targetTime = new Date(timestamp);

  console.log("Getting first transaction after we cross the timestamp: ", timestamp);
  let txnFetchComplete = false;
  try {
    while (!txnFetchComplete) {
      //we will keep fetching until we get the first transaction after the given timestamp
      var paramsToGetTransactions = {
        network: Network.Mainnet,
        account: address,
        txNum: 10,
      };

      if (oldestTxnSignature !== "")
        paramsToGetTransactions = {
          ...paramsToGetTransactions,
          beforeTxSignature: oldestTxnSignature,
        };

      const getTransactions = await shyftClient.transaction.history(
        paramsToGetTransactions
      );
      console.log("No. of transactions received from Token Address: ", getTransactions.length);

      if (getTransactions.length === 0) {
        //indicates no transactions to receive or all transactions have been received
        txnFetchComplete = true;
        break;
      }

      //updating beforeTxSignature for next paginated fetch
      if (getTransactions.length > 0)
        oldestTxnSignature = getTransactions[getTransactions.length - 1].signatures[0];

      console.log("Current last: ", getTransactions[getTransactions.length - 1].timestamp);

      for (let index = 0; index < getTransactions.length; index++) {
        const eachTransaction = getTransactions[index];

        const currentTransactionTime = new Date(eachTransaction.timestamp);
        if (currentTransactionTime < targetTime) {
          firstTransactionSignature = eachTransaction.signatures[0];
          txnFetchComplete = true;
          break;
          //we stop fetching as soon as we get the first txn after the given timestamp
        }
      }
    }
  } catch (error) {
    // console.dir(error, {depth: null});
    console.log("Some Error Occured");
  }
  return firstTransactionSignature;
}
async function getSwapTransaction(address, startTransaction, endingTimeISO) {
  let transactions = [];
  let oldestTxnSignature = startTransaction;
  console.log("So, we are fetching transactions from account: ", address);
  var transactionFetchComplete = false;
  var endingTime = new Date(endingTimeISO);

  try {
    while (!transactionFetchComplete) {
      //we will keep fetching until we get all transactions till the ending time
      var paramsToGetTransactions = {
        network: Network.Mainnet,
        account: address,
        txNum: 10,
      };
      if (oldestTxnSignature !== "")
        paramsToGetTransactions = {
          ...paramsToGetTransactions,
          beforeTxSignature: oldestTxnSignature,
        };

      const getTransactions = await shyftClient.transaction.history(
        paramsToGetTransactions
      );
      console.log("No of transactions received from Account: ", getTransactions.length);
      if (getTransactions.length === 0) {
        //indicates no transactions received i.e. all transactions have been received
        transactionFetchComplete = true;
        break;
      }

      if (getTransactions.length > 0)
        oldestTxnSignature = getTransactions[getTransactions.length - 1].signatures[0];

      for (let index = 0; index < getTransactions.length; index++) {
        const eachTransaction = getTransactions[index];

        var txnTimeStamp = new Date(eachTransaction.timestamp);

        if (endingTime > txnTimeStamp) {
          transactionFetchComplete = true;
          break;
        }

        //checking and filtering SWAP transactions from the transactions received
        if (eachTransaction.type === "SWAP")
          transactions.push(eachTransaction);
      }
    }
    console.log("Total Transactions that we saved: ", transactions.length);
  } catch (error) {
    console.log("Some error:", error.message);
  }
  return transactions;
}
function getOrcaSwaps(transactions, address) {
  try {
    //filtering transactions from Orca Whirlpool
    var orcaTransactions = transactions.filter((eachTxn) => eachTxn.protocol.address === address);
    return orcaTransactions;

  } catch (error) {
    console.log("Some error Occured");
    return [];
  }

}
function calculateAggData(transactions, address) {
  const totalSwaps = transactions.length;
  var VolumeFrom = 0;
  var VolumeTo = 0;
  var SOL = 0;
  var others = 0;

  try {
    for (let index = 0; index < transactions.length; index++) {
      const eachTransaction = transactions[index];
     
      if (eachTransaction.actions[0].info.tokens_swapped.in.token_address === address)
        VolumeFrom += eachTransaction.actions[0].info.tokens_swapped.in.amount ?? 0;

      if (eachTransaction.actions[0].info.tokens_swapped.out.token_address === address)
        VolumeTo += eachTransaction.actions[0].info.tokens_swapped.out.amount ?? 0;

      if (eachTransaction.actions[0].info.tokens_swapped.in.token_address === address)
        if (eachTransaction.actions[0].info.tokens_swapped.out.symbol === "SOL")
          SOL += eachTransaction.actions[0].info.tokens_swapped.out.amount ?? 0;
        else
          others += eachTransaction.actions[0].info.tokens_swapped.out.amount ?? 0;

      if (eachTransaction.actions[0].info.tokens_swapped.out.token_address === address)
        if (eachTransaction.actions[0].info.tokens_swapped.in.symbol === "SOL")
          SOL += eachTransaction.actions[0].info.tokens_swapped.in.amount ?? 0;
        else
          others += eachTransaction.actions[0].info.tokens_swapped.in.amount ?? 0;
    }
  } catch (error) {
    console.dir(error, {depth: null});
    console.log("some Error occured");
  }

  return {
    total_swaps: totalSwaps,
    total_volume: VolumeFrom + VolumeTo,
    volume_from: VolumeFrom,
    volume_to: VolumeTo,
    graph_data: [SOL, others]
  }

}