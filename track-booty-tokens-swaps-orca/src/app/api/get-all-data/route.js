import { ShyftSdk, Network } from "@shyft-to/js";
import { NextResponse } from "next/server";

const shyftClient = new ShyftSdk({
  apiKey: process.env.SHYFT_KEY,
  network: Network.Mainnet,
});

export const GET = async (req, res) => {
  try {
    const url = new URL(req.url);
    // const address = url.searchParams.get("address");
    const protocol = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc";
    const token = "bootyAfCh1eSQeKhFaDjN9Pu6zwPmAoQPoJWVuPasjJ";
    const dateTime = "2023-10-04T21:07:24.000Z";
    const endTime = "2023-10-04T21:02:08.000Z";

    if (!protocol) throw new Error("INVALID_ADDRESS");

    const firstTransaction = await getFirstTransactionsAfterTime(token,dateTime); 
    console.log("First Transaction Received: ", firstTransaction);
    console.log("Getting Swap Transactions After that....");
    const transactions = await getSwapTransaction(token,firstTransaction,endTime);
    
    // const getAggData = calculateTotalSales(transactions, address);
    // const getBuyers = countUniqueBuyers(transactions);
    // const formattedTxns = formatRecentTransactions(transactions);
    // const graphData = filterTxnForgraph(transactions);
    console.log("Total Transactions: ",transactions.length);
    return NextResponse.json({
      success: true,
      transactions: transactions
    });
    // return NextResponse.json({
    //   success: true,
    //   transactions: transactions,
    //   agg_data: getAggData,
    //   agg_buyers: getBuyers,
    //   formatted_transactions: formattedTxns,
    //   data_for_graph: graphData,
    // });
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

function addHours(date, hours) {
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);

  return date;
}
async function getFirstTransactionsAfterTime(address,timestamp)
{
  let firstTransactionSignature = "";
  let oldestTxnSignature = "";
  const targetTime = new Date(timestamp);

  console.log("Getting first transaction after we cross the timestamp: ",timestamp);
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
      console.log("No. of transactions received from Token Address: ",getTransactions.length);
      
      if (getTransactions.length === 0) {
        //indicates no transactions to receive or all transactions have been received
        txnFetchComplete = true;
        break;
      }

      //updating beforeTxSignature for next paginated fetch
      if (getTransactions.length > 0)
        oldestTxnSignature = getTransactions[getTransactions.length - 1].signatures[0];
    
      console.log("Current last: ",getTransactions[getTransactions.length - 1].timestamp);

      for (let index = 0; index < getTransactions.length; index++) {
        const eachTransaction = getTransactions[index];

        const currentTransactionTime = new Date(eachTransaction.timestamp);
        if(currentTransactionTime < targetTime)
        {
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
async function getSwapTransaction(address,startTransaction,endingTimeISO) {
  let transactions = [];
  let oldestTxnSignature = startTransaction;
  console.log("So, we are fetching transactions from account: ",address);
  var transactionFetchComplete = false;
  var endingTime = new Date(endingTimeISO);
  console.log("Ending time for: ",endingTime);

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
      console.log("No of transactions received from Account: ",getTransactions.length);
      if (getTransactions.length === 0) {
        //indicates no transactions received i.e. all transactions have been received
        transactionFetchComplete = true;
        break;
      }

      if (getTransactions.length > 0)
        oldestTxnSignature = getTransactions[getTransactions.length - 1].signatures[0];

      for (let index = 0; index < getTransactions.length; index++) {
        const eachTransaction = getTransactions[index];
        
        console.log("curr txn timestamnp: ",eachTransaction.timestamp);
        console.log("curr txn type", eachTransaction.type);

        var txnTimeStamp = new Date(eachTransaction.timestamp);

        if(endingTime > txnTimeStamp) {
          transactionFetchComplete = true;
          break;
        }
        
        //checking and adding SWAP transactions from the transactions received
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
function calculateTotalSales(transactions, address) {
  try {
    var totalTickets = 0;
    var totalPrice = 0;
    var eachTicketPrice = 0;
    if (transactions.length < 1) throw new Error("NOT_ENOUGH_TXNS");

    for (let index = 0; index < transactions.length; index++) {
      const eachTransaction = transactions[index];
      if (eachTransaction.actions[0].info.raffle_address === address) {
        console.log("current txn being scanned -", index);
        if (eachTicketPrice === 0)
          eachTicketPrice = eachTransaction.actions[0].info.ticket_price;

        totalTickets = totalTickets + eachTransaction.actions[0].info.tickets;
        totalPrice =
          totalPrice +
          eachTransaction.actions[0].info.tickets *
            eachTransaction.actions[0].info.ticket_price;
      }
    }
    return {
      total_tickets_sold: totalTickets,
      total_amount_sold: totalPrice,
      each_ticket_price: eachTicketPrice,
    };
  } catch (error) {
    console.log(error.message);
    return {
      total_tickets_sold: 0,
      total_amount_sold: 0,
      each_ticket_price: 0,
    };
  }
}

function countUniqueBuyers(transactions) {
  try {
    if (transactions.length < 1) throw new Error("NOT_ENOUGH_TXNS");

    var countBuyer = {};

    transactions.forEach((eachTxn) => {
      const currentInfo = eachTxn.actions[0].info;
      if (countBuyer[currentInfo.buyer]) {
        countBuyer[currentInfo.buyer] += currentInfo.tickets;
      } else {
        countBuyer[currentInfo.buyer] = currentInfo.tickets;
      }
    });
    var countBuyerArray = [];
    for (const key in countBuyer) {
      if (countBuyer.hasOwnProperty(key)) {
        const buyerObj = {
          buyer: key,
          tickets_bought: countBuyer[key],
        };
        countBuyerArray.push(buyerObj);
      }
    }

    return {
      buyers: countBuyerArray.sort(
        (a, b) => b.tickets_bought - a.tickets_bought
      ),
    };
  } catch (error) {
    console.log(error.message);
    return {
      buyers: false,
    };
  }
}

function formatRecentTransactions(transactions) {
  try {
    if (transactions.length < 1) throw new Error("NOT_ENOUGH_TXNS");
    const no_of_txns = transactions.length > 4 ? 5 : transactions.length;
    const formattedTxns = [];
    for (let index = 0; index < no_of_txns; index++) {
      const eachTransaction = transactions[index];
      var formattedTxn = {
        timestamp: eachTransaction.timestamp ?? "--",
        buyer: shortenAddress(eachTransaction.actions[0].info.buyer) ?? "--",
        tickets_bought: eachTransaction.actions[0].info.tickets ?? "--",
      };
      formattedTxns.push(formattedTxn);
    }
    return formattedTxns;
  } catch (error) {
    console.log(error.message);
    return [];
  }
}
function shortenAddress(address) {
  try {
    var trimmedString = "";
    if (address === "") return "unknown";
    if (address != null || address.length > 16) {
      trimmedString =
        address.substring(0, 8) + "..." + address.substring(address.length - 5);
    } else {
      trimmedString = address ?? "";
    }
    return trimmedString;
  } catch (error) {
    return address;
  }
}
function filterTxnForgraph(transactions) {
  const tickets_sold = [0, 0, 0, 0, 0, 0, 0];
  const revenue = [0, 0, 0, 0, 0, 0, 0];
  try {
    if (transactions.length < 1) throw new Error("NOT_ENOUGH_TXNS");
    for (let index = 0; index < transactions.length; index++) {
      const eachTransaction = transactions[index];
      const date = new Date(eachTransaction.timestamp);
      // console.log("date for txn ", index, date.getHours());
      if (date.getHours() < 10) {
        tickets_sold[0] += eachTransaction.actions[0].info.tickets;
        revenue[0] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else if (date.getHours() >= 10 && date.getHours() < 12) {
        tickets_sold[1] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[1] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else if (date.getHours() >= 12 && date.getHours() < 14) {
        tickets_sold[2] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[2] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else if (date.getHours() >= 14 && date.getHours() < 16) {
        tickets_sold[3] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[3] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else if (date.getHours() >= 16 && date.getHours() < 20) {
        tickets_sold[4] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[4] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else if (date.getHours() >= 20 && date.getHours() < 22) {
        tickets_sold[5] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[5] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      } else {
        tickets_sold[6] += eachTransaction.actions[0].info?.tickets ?? 0;
        revenue[6] +=
          (eachTransaction.actions[0].info.tickets ?? 0) *
          (eachTransaction.actions[0].info?.ticket_price ?? 1);
      }
    }
    return {
      tickets_sold: tickets_sold,
      revenue: revenue,
    };
  } catch (error) {
    console.log(error.message);
    return {
      tickets_sold: tickets_sold,
      revenue: revenue,
    };
  }
}
