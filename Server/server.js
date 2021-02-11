/* include express.js & socket.io */
const express = require("express");
const app = express();
const http = require("http");
//const https = require("https");
const socket = require("socket.io");
//const cors = require("cors");

/* include other packages */
const inquirer = require("inquirer");
const open = require("open");
const TextDecoder = require("text-encoding").TextDecoder;
const fs = require("fs");
const rp = require('request-promise');
const bodyParser = require('body-parser');

/* utilities */
const utils = require('./utils.js');
const initQuestions = utils.initQuestions;
const connQuestions = utils.connectQuestions;
const secondsToDate = utils.secondsToDate;
const log = utils.handleLog;
const sleep = utils.sleep;
const convert = (from, to) => str => Buffer.from(str, from).toString(to);
const hexToStr = convert('hex', 'utf8');

/* config */
const config = require('./config/config.js');
const tallyConfig = config.dragonGlassConfig;
const httpsConfig = config.httpsConfig;

const newElectionConfig = require('./config/electionConfig.json');

/* security */
const security = require("./security.js");

const HederaClass = require('./hedera');

/* init variables */
// const mirrorNodeAddress = new MirrorClient(
//     "hcs.testnet.mirrornode.hedera.com:5600"
// );
const specialChar = "~";
let topicId = "";
let logStatus = "Default";
let topicMemo = "";
let uidList = [[],[]];
let electionId = 0;
let startDate;
let endDate;
let HederaObj;
let confirmList = []; // [(uidHash1, res), (uidHash2, res), ...]

let secure = false;


let webServer;

/* configure our env based on prompted input */
async function init() {
    if(process.argv.find(({arg}) => arg === '-dev') !== null) {
        try{
            logStatus = 'debug';
            HederaObj = new HederaClass("", "", logStatus);
            configureServer();
            configureTopicMemo();
            await createTopic();
            runServer();
        } catch (error) {
            log('ERROR: init()', error, logStatus);
            process.exit(1);
        }
    }else{
        inquirer.prompt(initQuestions).then(async function(answers) {
            try {
                logStatus = answers.status;
                HederaObj = new HederaClass(answers.account, answers.key, logStatus);
                configureServer();
                if (answers.start.includes("start")) {
                    configureTopicMemo();
                    await createTopic();
                } else {
                    await connectTopic();
                }
                /* run & serve the express app */
                runServer();
            } catch (error) {
                log("ERROR: init()", error, logStatus);
                process.exit(1);
            }
        });
    }
}

/*
-------------------------------------------------------------------------
runServer()
-------------------------------------------------------------------------
Opens and runs a server on a random HTTP port. Subscribes to the mirror
node to record transaction receipts. Listens for chat messages (aka form
submissions) and formats the message to be submitted to HCS.
-------------------------------------------------------------------------
 */
function runServer() {
    log('runServer()', 'Server Starting...', logStatus);
    //loadUidList('./uid_list.txt');                             // FIXME: Change to config variable??
    if(secure){
        webServer.listen(443, () => {
            log('runServer()', `webServer listening on ${webServer.address().port}`, logStatus);
        });
    }else{
        webServer.listen(80, () => {
            log('runServer()', `webServer listening on ${webServer.address().port}`, logStatus);
        });
    }
    HederaObj.subscribeToMirror(confirmList);
}

function configureServer() {
    if(secure){
        const options = {
            cert: fs.readFileSync(`./Server/config/${httpsConfig.cert}`),
            ca: fs.readFileSync(`./Server/config/${httpsConfig.chain}`)
        };

        app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.setHeader('Access-Control-Allow-Credentials', true);
            next();
        });

        webServer = https.createServer(options,app);
    } else {
        webServer = http.createServer(app);
    }

    app.use(bodyParser.json());  ////////////////////////////////////////////////////
    app.use(express.urlencoded({extended: false}));
    app.use(express.static("dist/public"));

    app.post('/api/submit', (req,res) => {
        const vote = security.hash(req.body.candidateName);

        console.log(`Vote '${vote}' received!`);
        
        HederaObj.sendHCSMessage(vote);

        console.log(`Submitted vote '${vote}'`);

        confirmList.push({aid: vote, resp: res});
    });

    log('configureServer()', 'Server Configured!', logStatus);
}

function loadUidList(fileName) {
    let data = fs.readFileSync(fileName, 'utf8');
    temp = data.split('\n');
    for(let i=0; i < temp.length; i++){
        uidList[0][i] = temp[i].split(',')[0];
        uidList[1][i] = temp[i].split(',')[1];
    }
    log('Loaded UID list from', fileName, logStatus);
}

function checkUidList(uid, email){
    if(uidList[0].includes(uid)){
        log('Matching  UID found...', `\'${email.trim()}\' === \'${uidList[1][uidList[0].indexOf(uid)].trim()}\'`, logStatus);
        if(uidList[1][uidList[0].indexOf(uid)].trim() === email.trim()){
            log('Matching Email To UID...', '', logStatus);
            return true;
        }
        else
            return false;
    }
    else
        return false;
}

// Returns true if no votes exist for that uid or a vote exists with the same email
async function checkExistingVotes(uid, email) {
    console.log('Checking existing votes');
    try {
        let votes = await utils.pullVotes(topicId, tallyConfig.XAPIKEY, rp, logStatus);
        let uidHash = security.hash(uid);

        for(let i = 0; i < votes.length; i++) {
            if(votes[i].split('~')[0] === uidHash){
                let emailHash = security.hash(email);
                if(votes[i].split('~')[3] === emailHash)
                    return true;
                else
                    return false;
            }
        }
        return true;
    } catch (err) {
        log('checkExistingVotes()', err, logStatus);
    }
}

/*
-------------------------------------------------------------------------
configureTopicMemo()
-------------------------------------------------------------------------
Takes in the newElectionConfig data and stores it as Dates and strings
accordingly in global variables.
-------------------------------------------------------------------------
 */
function configureTopicMemo() {
    startDate = new Date(newElectionConfig.startDate);
    endDate = new Date(newElectionConfig.endDate);
    electionId = newElectionConfig.electionId;
    topicMemo = `${electionId}${specialChar}${startDate.getTime()}${specialChar}${endDate.getTime()}`
}

/*
-------------------------------------------------------------------------
createTopic()
-------------------------------------------------------------------------
Calls upon the configureTopicMemo() and createTopicTransaction() functions to
create a new topic and store the new topic ID to `topicId`.
-------------------------------------------------------------------------
*/
async function createTopic() {
    try {
        log("createTopic()", "Creating New Topic...", logStatus);
        log(
            "ConsensusTopicCreateTransaction()",
            "waiting for new HCS Topic & mirror node (it may take a few seconds)",
            logStatus
        );
        topicId = await HederaObj.createTopicTransaction(topicMemo);
        log("createTopic()", `New Topic Created, ID = ${topicId}`, logStatus);
        await sleep(9000);
        return;
    } catch (error) {
        log("ERROR: createTopic() failed", error, logStatus);
        process.exit(1);
    }
}

/*
-------------------------------------------------------------------------
connectTopic()
-------------------------------------------------------------------------
Prompts the user for the topic ID to connect to, checks if the length
of the topic ID is valid and creates a ConsensusTopicId from the
*/
async function connectTopic() {
    await inquirer.prompt(connQuestions).then(function(answers) {
        try {
            const topicIdStr = answers.topic;
            topicId = ConsensusTopicId.fromString(topicIdStr);
            log("connectTopic()", `connected to ${topicIdStr}`, logStatus);
        } catch (error) {
            log("ERROR: connectTopic() failed", error, logStatus);
            process.exit(1);
        }
    });
}

init(); // process arguments & handoff to runChat()