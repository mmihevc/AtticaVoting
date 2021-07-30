/* general imports */
const inquirer = require("inquirer");
const rp = require("request-promise");
const {
    Client,
    PrivateKey
} = require("@hashgraph/sdk");

/* config */
const tallyConfig = require("./config/config.js").dragonGlassConfig;

/* utilities */
const utils = require('./utils.js');
const security = require('./security.js');
const tallyQuestions = utils.tallyQuestions;
const hederaConfig = require('./config/config.js').hederaConfig;
const HederaClass = require("./hedera.js");
const log = utils.handleLog;
const populateCandidates = utils.populateCandidates;
const pullVotes = utils.pullVotes;
const convert = (from, to) => str => Buffer.from(str, from).toString(to);
const hexToStr = convert('hex', 'utf8');

/*
-------------------------------------------------------------------------
init()
Uses our two helper functions configTopicId() and pullVotes to pull the
votes from the Dragon Glass API and store them in an array.
-------------------------------------------------------------------------
 */

async function init() {
    await inquirer.prompt(tallyQuestions).then(async function(answers) {
        try{
            let topicId = answers.topic;
            log('init()', '~Topic ID Set~', 'debug');

            let acctInfo = handleAnswers(answers.account, answers.key);
            let HederaObj = new HederaClass(acctInfo.acctId, acctInfo.privKey, 'default')
            log('init()', `~Hedera Client Configured~`, 'debug');

            // NEEDS TO BE FIXED
            //
            // let topicInfo = await HederaObj.pullTopicInfo(topicId);
            let topicInfo = '00001~1614215880000~1614216180000';
            console.log(`DEBUG2: ${topicInfo}`)
            let topicSplit = topicInfo.split('~');
            log('init()', '~Topic Info Pulled~', 'debug');

            let votes = await HederaObj.pullVotes(topicSplit[0], topicSplit[1], topicId);
            Promise.all([votes]);
            log('init()', '~Votes Pulled~', 'debug');

            console.log(`DEBUG: ${votes}`);
        } catch (err) {
            log('ERROR: init()', err, 'debug');
        }
    });
}

// async function init() {
//     await inquirer.prompt(tallyQuestions).then(async function(answers) {
//         try{
//             // Topic Id Set
//             let topicId = answers.topic;

//             // Hedera client configured
//             let hClient = Client.forTestnet();
//             configureClient(answers.account, answers.key, hClient);
//             console.log(`~Hedera Client Configured~`);

//             // Votes pulled from DragonGlass
//             let votes = await pullVotes(topicId, tallyConfig.XAPIKEY, rp, 'default');
//             Promise.all([votes]);
//             console.log(`~Votes Pulled~`);

//             // Topic info pulled from info query
//             let topicInfo = await pullTopicInfo(topicId, hClient);
//             Promise.all([topicInfo]);
//             console.log(`~Topic Info Pulled~`);

//             // Tally and print votes
//             let cands = await tally(votes, topicInfo, answers.pass);
//             //console.log(cands);
//             prettyPrint(cands);

//         } catch (error) {
//             log("ERROR: init()", error, "default");
//         }
//     });
// }

function prettyPrint(cands) {
    console.log(`-----------------------------------------\n| Candidate Name\t\t| Votes\t|\n|---------------------------------------|`);
    let filler = ``;
    for (let i = 0; i < cands.length; i++) {
        if(cands[i].candName.length <= 5)
            filler = `\t\t\t\t`;
        else if(cands[i].candName.length <= 10)
            filler = `\t\t\t`;
        else if(cands[i].candName.length <= 15)
            filler = `\t\t`;
        else if(cands[i].candName.length <= 20)
            filler = `\t`;
        console.log(`| ${cands[i].candName}${filler}| ${cands[i].votes}\t|`);
    }
    console.log(`-----------------------------------------`);
}

function handleAnswers (account, key) {
    let acctId, privKey;
    try {
        if(account !== "")
            acctId = account;
        else
            acctId = hederaConfig.account;
        if(key !== "")
            privKey = PrivateKey.fromString(key);
        else
            privKey = PrivateKey.fromString(hederaConfig.key);
    } catch (error) {
        log("ERROR: configureClient()", error, "default");
    }
    return {'acctId': acctId, 'privKey': privKey};
}

async function pullTopicInfo(topicId, client) {
    let topicInfo;
    try {
        topicInfo = await new ConsensusTopicInfoQuery()
            .setTopicId(topicId)
            .execute(client);
    } catch (err) {
        log("ERROR: pullTopicInfo()", err, "default");
    }

    return topicInfo;
}

async function tally (votes, topicInfo, pass) {
    let candidates = populateCandidates();
    try {
        let keys = await security.getKeys(pass);
        Promise.all([keys.priv, keys.pub]);

        for (let i=votes.length-1; i>=0; i--) {

            let curr = votes[i].split('~');
            let encVote = curr[1];

            // base64(hash(student id)) = curr[0]
            // base64(encrypted(student id hash ~ vote)) = curr[1]
            // timestamp = curr[2]

            if(checkTimeValid(curr[2], topicInfo)){          // FIXME: Topic memo showing blank again

                let decVoteMessage = await security.decrypt(security.decode(encVote), keys.pub, keys.priv);
                Promise.all([decVoteMessage]);

                let currIdHash = decVoteMessage.split('~')[0];
                let currVote = decVoteMessage.split('~')[1];

                let prevVote = checkCandidatesContainingHash(candidates, currIdHash);
                if(prevVote !== null)
                    prevVote.removeVote(currIdHash);
                for(let j=0; j<candidates.length; j++) {
                    if(currVote == candidates[j]['candName']){
                        candidates[j].addVote(currIdHash);
                        break;
                    }
                }


            }
        }
    } catch (err) {
        log("ERROR: tally()", err, "default");
    }
    return candidates;
}

function checkCandidatesContainingHash(candidates, idHash) {
    for(let i = 0; i < candidates.length; i++) {
        if(candidates[i].voters.includes(idHash))
            return candidates[i]
    }
    return null;
}

function checkTimeValid(timestamp, topicInfo){
    let temp = topicInfo.topicMemo.split('~');
    let start = parseInt(temp[1]);
    let end = parseInt(temp[2]);
    if(timestamp >= start           // Not submitted before start time
        && timestamp <= end)       // Not submitted after end time
        return true;
    else
        return false;
}

init();