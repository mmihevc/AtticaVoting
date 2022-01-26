/* include express.js & socket.io */
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
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

const HederaClass = require('./hedera.js');
const { encrypt } = require("openpgp");

import {handleLog} from './utils' 

/* init variables */
// const mirrorNodeAddress = new MirrorClient(
//     "hcs.testnet.mirrornode.hedera.com:5600"
// );
const specialChar = "~";
let topicId = "";
let logStatus = "Default";
let topicMemo = "";
let HederaObj;
let confirmList = []; // [(uidHash1, res), (uidHash2, res), ...]

let secure = false;

let webServer;

/* configure our env based on prompted input */
async function init() {
    if(process.argv.find(({arg}) => arg === '-dev') !== null) {
        try{
            logStatus = 'debug';
            await createTopic();
            runServer();
        } catch (error) {
            handleLog('ERROR: init()', error, logStatus);
            process.exit(1);
        }
    }else{
        inquirer.prompt(initQuestions).then(async function(answers) {
            try {
                logStatus = answers.status;
                HederaObj = new HederaClass(answers.account, answers.key, logStatus);
                if (answers.start.includes("start")) {
                    await createTopic();
                } else {
                    await connectTopic();
                }
                /* run & serve the express app */
                runServer();
            } catch (error) {
                handleLog("ERROR: init()", error, logStatus);
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
    handleLog('runServer()', 'Server Starting...', logStatus);
    //loadUidList('./uid_list.txt');                             // FIXME: Change to config variable??
    if(secure){
        webServer.listen(443, () => {
            handleLog('runServer()', `webServer listening on ${webServer.address().port}`, logStatus);
        });
    }else{
        webServer.listen(80, () => {
            handleLog('runServer()', `webServer listening on ${webServer.address().port}`, logStatus);
        });
    }
    HederaObj.subscribeToMirror(confirmList);
}




/*
-------------------------------------------------------------------------
connectTopic()
-------------------------------------------------------------------------
Prompts the user for the topic ID to connect to, checks if the length
of the topic ID is valid and creates a ConsensusTopicId from the
*/
/*async function connectTopic() {
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
}*/

init(); // process arguments & handoff to runChat()