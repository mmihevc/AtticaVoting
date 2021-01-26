/* include express.js & socket.io */
const express = require("express");
const app = express();
const http = require("http");
//const io = require("socket.io")(http);
//const https = require("https");
const socket = require("socket.io");
//const cors = require("cors");

/* include other packages */
const inquirer = require("inquirer");
const open = require("open");
const TextDecoder = require("text-encoding").TextDecoder;
const fs = require("fs");
const rp = require('request-promise');

/* Hedera.js */
const {
    Client,
    ConsensusSubmitMessageTransaction,
    ConsensusTopicId,
    ConsensusTopicCreateTransaction,
    MirrorClient,
    MirrorConsensusTopicQuery,
    Ed25519PrivateKey
} = require("@hashgraph/sdk");

/* utilities */
const utils = require('./utils.js');
const initQuestions = utils.initQuestions;
const connQuestions = utils.connectQuestions;
const UInt8ToString = utils.UInt8ToString;
const secondsToDate = utils.secondsToDate;
const log = utils.handleLog;
const sleep = utils.sleep;
const convert = (from, to) => str => Buffer.from(str, from).toString(to);
const hexToStr = convert('hex', 'utf8');

/* config */
const config = require('./config/config.js');
const hederaConfig = config.hederaConfig;
const tallyConfig = config.dragonGlassConfig;

const newElectionConfig = require('./config/electionConfig.json');

/* security */
const security = require("./security.js");

const routing = require('./routing');

/* init variables */
const mirrorNodeAddress = new MirrorClient(
    "hcs.testnet.mirrornode.hedera.com:5600"
);
const specialChar = "~";
let operatorKey;
let operatorAccount = "";
let HederaClient = Client.forTestnet();
let topicId = "";
let logStatus = "Default";
let topicMemo = "";
let uidList = [[],[]];
let electionId = 0;
let startDate;
let endDate;

var webServer, io;

/* configure our env based on prompted input */
async function init() {
    inquirer.prompt(initQuestions).then(async function(answers) {
        try {
            logStatus = answers.status;
            configureAccount(answers.account, answers.key, HederaClient);
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
    webServer.listen(8443, () => {
        log('runServer()', `webServer listening on ${webServer.address().port}`, logStatus);
    });
    subscribeToMirror();
    io.on("connection", function(client) {
        client.on("chat message", async function(msg) {
            try {
                if(checkUidList(msg.split('~')[0], msg.split('~')[1]) && await checkExistingVotes(msg.split('~')[0], msg.split('~')[1])){
                    log('runServer()', 'Checks Passed, Submitting Vote...', logStatus);
                    const formattedMessage = await formatVoteMessage(msg);
                    Promise.all([formattedMessage]);
                    sendHCSMessage(formattedMessage);
                }
                else{
                    log('Discrepency in vote found!', '', logStatus);
                    setTimeout(function() {io.emit('confMessage', 'No Vote')}, 3000);
                }
            } catch (err) {
                log('ERROR: runServer()', err, logStatus);
            }
        });
        client.on("waiting", function(msg) {
            let uidHash = security.hash(security.decode(msg));
            client.join(uidHash);
        });
        client.on("leaving", function(msg) {
            let uidHash = security.hash(security.decode(msg));
            client.leave(uidHash);
        });
    });
}

function configureServer() {
    /*const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/atticavoting.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/atticavoting.com/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/atticavoting.com/chain.pem')
    };*/
    app.use('router', routing);

    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.use(express.static("dist/public"));
    app.use(express.static("Client/static"));

    app.use('/', routing);

    //webServer = https.createServer(options, app);
    webServer = http.createServer(app);
    io = socket.listen(webServer);

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
sendHCSMessage()
-------------------------------------------------------------------------
Helper function given by Hedera's Cooper Kunz. Function builds a new
ConsensusSubmitMessageTransaction and sends the messages to the
configured TopicID
-------------------------------------------------------------------------
 */
async function sendHCSMessage(msg) {
    try {
        new ConsensusSubmitMessageTransaction()
            .setTopicId(topicId)
            .setMessage(msg)
            .execute(HederaClient);
        log("ConsensusSubmitMessageTransaction()", msg, logStatus);
    } catch (error) {
        log("ERROR: ConsensusSubmitMessageTransaction()", error, logStatus);
        process.exit(1);
    }
}

/*
-------------------------------------------------------------------------
subscribeToMirror()
-------------------------------------------------------------------------
Helper function given by Hedera's Cooper Kunz. Function subscribes to
the topic through the mirror consensus nodes.
-------------------------------------------------------------------------
 */
function subscribeToMirror() {
    try {
        new MirrorConsensusTopicQuery()
            .setTopicId(topicId)
            .subscribe(mirrorNodeAddress, res => {
                //log('DEBUG:', `${res['runningHash']}\nDEBUG: ${typeof res['runningHash']}`, logStatus);
                let encMsg = new TextDecoder("utf-8").decode(res["message"]);
                let confMsg = formatConfirmationMessage(encMsg, res.sequenceNumber, UInt8ToString(res['runningHash']));
                let uidHash = encMsg.split(specialChar)[0];

                log('subscribeToMirror()', `Emitting Confirmation Message To: ${uidHash}`, logStatus);

                io.to(uidHash).emit('confMessage', confMsg);
            });
        log("MirrorConsensusTopicQuery()", topicId.toString(), logStatus);
    } catch (error) {
        log("ERROR: MirrorConsensusTopicQuery()", error, logStatus);
        process.exit(1);
    }
}

function formatConfirmationMessage(encMsg, seqNum, runningHash){
    let retStr = `${topicId}~${seqNum}~${encMsg}~${runningHash}`;
    return retStr;
}

/*
-------------------------------------------------------------------------
createTopicTransaction()
-------------------------------------------------------------------------
Function builds a ConsensusTopicCreateTransaction object with the
configured topic memo and operator keys. Configures the topicID variable
to the newly created topic.
-------------------------------------------------------------------------
 */
async function createTopicTransaction(memo) {
    try {
        const txId = await new ConsensusTopicCreateTransaction()
            .setTopicMemo(memo)
            .setSubmitKey(operatorKey.publicKey)
            .execute(HederaClient);
        log("ConsensusTopicCreateTransaction()", `submitted tx ${txId}`, logStatus);
        await sleep(3000); // wait until Hedera reaches consensus
        const receipt = await txId.getReceipt(HederaClient);
        const newTopicId = receipt.getConsensusTopicId();
        log("ConsensusTopicCreateTransaction()", `success! new topic ${newTopicId}`, logStatus);
        return newTopicId;
    } catch (error) {
        log("ERROR: createTopicTransaction()", error, logStatus);
        process.exit(1);
    }
}

/*
-------------------------------------------------------------------------
configureAccount(account, key)
-------------------------------------------------------------------------
Takes in the answers, if either account or key is empty, function will
take the values from 'hederaConfig' and assign them to `operatorKey` and
`operatorAccount`
-------------------------------------------------------------------------
*/
function  configureAccount(account, key, client) {
    try {
        if(account !== "") {
            operatorAccount = account;
        }else {
            operatorAccount = hederaConfig.account;
        }
        if(key !== "") {
            operatorKey = Ed25519PrivateKey.fromString(key);
        } else {
            operatorKey = Ed25519PrivateKey.fromString(hederaConfig.key);
        }

        client.setOperator(operatorAccount, operatorKey);

    } catch (error) {
        log("ERROR: configureAccount()", error, logStatus);
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
        topicId = await createTopicTransaction(topicMemo);
        log(
            "ConsensusTopicCreateTransaction()",
            "waiting for new HCS Topic & mirror node (it may take a few seconds)",
            logStatus
        );
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

async function formatVoteMessage(msg) {
    let res = '';

    let temp = msg.split('~');
    let id = temp[0];
    let email = temp[1];
    let vote = temp[2];

    let idHash = security.hash(id);
    res += idHash + specialChar;

    let pub = await security.getPublicKey();
    Promise.all([pub]);

    let encVote = await security.encrypt(idHash + specialChar + vote, pub);
    Promise.all([encVote]);
    res += security.encode(encVote) + specialChar;

    res += new Date().getTime() + '' + specialChar;

    res += security.hash(email);

    return res;
}

init(); // process arguments & handoff to runChat()