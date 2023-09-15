import { NextResponse } from "next/server";
import axios from "axios";

const supportedNetworks = ["devnet", "mainnet-beta"];

export const GET = async (req, res) => {
  try {
    const url = new URL(req.url);
    const proposal_address = url.searchParams.get("proposal");

    const transactions = await getProposalTransactions(proposal_address, "mainnet-beta");
    const allVotesData = getVotes(transactions.transactions);
    const miscData = await getMiscData(transactions.transactions[0].actions[0]);

    return NextResponse.json({
      success: true,
      transactions: transactions,
      votes_data: allVotesData,
      misc_data: miscData 
    });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
};

async function getProposalTransactions(address, network) {
  try {
    if (!address) throw new Error("EMPTY_ADDRESS");
    if (!supportedNetworks.includes(network))
      throw new Error("UNSUPPORTED_NETWORK");

    var proposalName = "";
    var castVoteTransactions = [];
    var oldestTxnSignature = "";
    

    var isFetchComplete = false;

    while (isFetchComplete === false) {
      var paramsForRequest = {
        network: network,
        account: address,
      };
      if (oldestTxnSignature !== "")
        paramsForRequest = {
          ...paramsForRequest,
          before_tx_signature: oldestTxnSignature,
        };
      console.log("Trying to get data");
      var getTransactions = {};
      try {
        getTransactions = await axios({
          url: "https://api.shyft.to/sol/v1/transaction/history",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.SHYFT_KEY ?? "---",
          },
          params: paramsForRequest,
        });
      } catch (error) {
        console.log(error.message);
        throw new Error("AXIOS_ERROR");
      }
      if (getTransactions.data.success === false) throw new Error("BAD_REQUEST");
      if (getTransactions.data.result.length === 0)
      {
        isFetchComplete = true;
        break;
      }
      const transactions = getTransactions.data.result;
      console.log("Total Txns Received ", transactions.length);
      for (let index = 0; index < transactions.length; index++) {
        const eachTransaction = transactions[index];
        
        if(eachTransaction.type === "CREATE_PROPOSAL" && proposalName === "") {
            const nameAction = eachTransaction.actions.filter((action) => action.type === "CREATE_PROPOSAL");
            // console.log("name Action",nameAction);
            proposalName = nameAction[0].info.proposal_name;
        }
        if(eachTransaction.type === "CAST_VOTE") {
          castVoteTransactions.push(eachTransaction);
        }
        
      }
      
      return {
        success: true,
        proposal_name: proposalName,
        transactions: castVoteTransactions
      }
      

    }
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      proposal_name: "",
      transactions: ""
    }
  }
}

function getVotes(transactions) {
  try {
    var approved = 0;
    var disapproved = 0;
    var totalVotes = 0;
    if(transactions.length < 1)
      throw new Error("NOT_ENOUGH_TXNS")

    for (let index = 0; index < transactions.length; index++) {
      const eachTransaction = transactions[index];
      // console.log("Checking Transaction: ", index);
      const voteAction = eachTransaction.actions.filter((action) => action.type === "CAST_VOTE");
      //alternatively, you can also view the first action in the actions array
      // const voteAction = eachTransaction.actions[0];
      if(voteAction[0].info?.vote_type === "Approve")
        approved++;
      else
        disapproved++;

      totalVotes++;
    }
    return {
      success: true,
      approved: approved,
      disapproved: disapproved,
      total_votes: totalVotes,
      vote_map: [approved,disapproved],
      motion_passed: approved > disapproved
    }
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      approved: 0,
      disapproved: 0,
      total_votes: 0,
      vote_map: [0,0],
      motion_passed: false
    }
  }
  
}
async function getMiscData(action) {
  try {
    const govTokenAddress = action.info?.vote_governing_token ?? "";
    const realmAddress = action.info?.realm_address ?? "";
    const governanceAddress = action.info?.governance ?? "";
    var governingTokenDetails = {};
    if(govTokenAddress !== "")
    {
      try {
        var getTokenInfo = await axios({
          url: "https://api.shyft.to/sol/v1/token/get_info",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.SHYFT_KEY ?? "---",
          },
          params: {
            network: "mainnet-beta",
            token_address: govTokenAddress
          }
        });
        if(getTokenInfo.data.success === true)
          governingTokenDetails = getTokenInfo.data.result;
      } catch (error) {
        console.log(error.message);
        throw new Error("AXIOS_ERROR")
      }
    }
    return {
      success: true,
      governing_token_address: govTokenAddress,
      governing_token_details: governingTokenDetails,
      realm_address: realmAddress,
      governance_address: governanceAddress
    }
  } catch (error) {
    console.log(error.message);

  }
  
}
