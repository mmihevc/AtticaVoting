
const submitVote = async (_, args, context, info) => {

  return {
    _id: "1234",
    raceVotes: [
      {
        electionItem: {
          _id: "5678",
          name: "name",
          race: {

          }
        }
      }
    ]
  }
 
  /*app.post('/api/submit', async (req,res) => {
    try{    
        let submittedVote = ``;
        const id = req.body.name + req.body.email;
        const anonID = security.hash(`${id}${Math.floor(Math.random() * 1000)}`);

        submittedVote += `${anonID}~`;

        const votes = JSON.stringify(req.body.candidatesChosen);
        const encrypted = await security.encrypt(`${anonID}~${votes}`, pubKey);
        const encoded = security.encode(encrypted);

        submittedVote += `${encoded}~`;

        const timestamp = Date.now();

        submittedVote += `${timestamp}`
        
        HederaObj.sendHCSMessage(submittedVote);

        log('API Submit', `Vote Submitted!\n~AnonId=${anonID}\n~EncVote=${encoded}\n~Timestamp=${timestamp}`);

        confirmList.push({aid: anonID, resp: res});
    }catch (err){
        log('API Submit Error', err);
    }
});*/
};

export default submitVote
