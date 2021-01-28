

let submit = [];

submit.push({
   path: '/submit',
   callback: (req,res) => {
       const vote = req.body.candidateName;

       console.log(`Vote for '${vote}' received`);

       res.send({success: true, topicId: '0.0.1234', runningHash: '12345567890abcdef', message: `I voted for ${vote}`});
   }
});

module.exports = submit;