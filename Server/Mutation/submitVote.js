var ObjectID = require('mongodb').ObjectID;

const SubmitVote = async (_, args, context, info) => {

  console.log('Submitting vote...')

  let election = await context.db.collection("Election").findOne({_id: ObjectID(args.electionID)});

  let topicID = election.topicID;

  context.hederaClient.sendHCSMessage(`${JSON.stringify(args.winners)}`, topicID);

  console.log('Vote Submitted!')


  return true
};

export default SubmitVote
