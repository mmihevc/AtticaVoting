"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/* include express.js & socket.io */
var express = require("express");
var app = express();
var http = require("http");
var https = require("https");
//const cors = require("cors");
/* include other packages */
var inquirer = require("inquirer");
var open = require("open");
var TextDecoder = require("text-encoding").TextDecoder;
var fs = require("fs");
var rp = require('request-promise');
var bodyParser = require('body-parser');
var passpost_saml = require('passport-saml');
/* utilities */
var utils = require('./utils.js');
var initQuestions = utils.initQuestions;
var connQuestions = utils.connectQuestions;
var secondsToDate = utils.secondsToDate;
var log = utils.handleLog;
var sleep = utils.sleep;
var convert = function (from, to) { return function (str) { return Buffer.from(str, from).toString(to); }; };
var hexToStr = convert('hex', 'utf8');
/* config */
var config = require('./config/config.js');
var tallyConfig = config.dragonGlassConfig;
var httpsConfig = config.httpsConfig;
var newElectionConfig = require('./config/electionConfig.json');
/* security */
var security = require("./security.js");
var HederaClass = require('./hedera');
var encrypt = require("openpgp").encrypt;
/* init variables */
// const mirrorNodeAddress = new MirrorClient(
//     "hcs.testnet.mirrornode.hedera.com:5600"
// );
var specialChar = "~";
var topicId = "";
var logStatus = "Default";
var topicMemo = "";
var uidList = [[], []];
var electionId = 0;
var startDate;
var endDate;
var HederaObj;
var confirmList = []; // [(uidHash1, res), (uidHash2, res), ...]
var candidateList;
var secure = false;
var webServer;
/* configure our env based on prompted input */
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(process.argv.find(function (_a) {
                        var arg = _a.arg;
                        return arg === '-dev';
                    }) !== null)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    logStatus = 'debug';
                    HederaObj = new HederaClass("", "", logStatus);
                    configureServer();
                    configureTopicMemo();
                    return [4 /*yield*/, createTopic()];
                case 2:
                    _a.sent();
                    runServer();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    log('ERROR: init()', error_1, logStatus);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 6];
                case 5:
                    inquirer.prompt(initQuestions).then(function (answers) {
                        return __awaiter(this, void 0, void 0, function () {
                            var error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        logStatus = answers.status;
                                        HederaObj = new HederaClass(answers.account, answers.key, logStatus);
                                        configureServer();
                                        if (!answers.start.includes("start")) return [3 /*break*/, 2];
                                        configureTopicMemo();
                                        return [4 /*yield*/, createTopic()];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, connectTopic()];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4:
                                        /* run & serve the express app */
                                        runServer();
                                        return [3 /*break*/, 6];
                                    case 5:
                                        error_2 = _a.sent();
                                        log("ERROR: init()", error_2, logStatus);
                                        process.exit(1);
                                        return [3 /*break*/, 6];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        });
                    });
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
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
    if (secure) {
        webServer.listen(443, function () {
            log('runServer()', "webServer listening on " + webServer.address().port, logStatus);
        });
    }
    else {
        webServer.listen(80, function () {
            log('runServer()', "webServer listening on " + webServer.address().port, logStatus);
        });
    }
    HederaObj.subscribeToMirror(confirmList);
}
function configureServer() {
    return __awaiter(this, void 0, void 0, function () {
        var pubKey, options;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, security.getPublicKey()];
                case 1:
                    pubKey = _a.sent();
                    app.use(bodyParser.json());
                    app.use(express.urlencoded({ extended: false }));
                    app.use(express.static("dist/public"));
                    app.use(express.static("Server/public"));
                    app.post('/api/submit', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var submittedVote, id, anonID, votes, encrypted, encoded, timestamp, err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    submittedVote = "";
                                    id = req.body.name + req.body.email;
                                    anonID = security.hash("" + id + Math.floor(Math.random() * 1000));
                                    submittedVote += anonID + "~";
                                    votes = JSON.stringify(req.body.candidatesChosen);
                                    return [4 /*yield*/, security.encrypt(anonID + "~" + votes, pubKey)];
                                case 1:
                                    encrypted = _a.sent();
                                    encoded = security.encode(encrypted);
                                    submittedVote += encoded + "~";
                                    timestamp = Date.now();
                                    submittedVote += "" + timestamp;
                                    HederaObj.sendHCSMessage(submittedVote);
                                    log('API Submit', "Vote Submitted!\n~AnonId=" + anonID + "\n~EncVote=" + encoded + "\n~Timestamp=" + timestamp, logStatus);
                                    confirmList.push({ aid: anonID, resp: res });
                                    return [3 /*break*/, 3];
                                case 2:
                                    err_1 = _a.sent();
                                    log('API Submit Error', err_1, logStatus);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/candidates', function (req, res) {
                        res.send(candidateList);
                    });
                    if (secure) {
                        options = {
                            key: fs.readFileSync("./Server/config/" + httpsConfig.key),
                            cert: fs.readFileSync("./Server/config/" + httpsConfig.cert)
                        };
                        app.use(function (req, res, next) {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
                            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                            res.setHeader('Access-Control-Allow-Credentials', true);
                            next();
                        });
                        webServer = https.createServer(options, app);
                    }
                    else {
                        webServer = http.createServer(app);
                    }
                    getCandidateList();
                    log('configureServer()', 'Server Configured!', logStatus);
                    return [2 /*return*/];
            }
        });
    });
}
function getCandidateList() {
    var file_data = fs.readFileSync('./Server/candidates.json');
    candidateList = JSON.parse(file_data);
}
// OBSOLETE
function loadUidList(fileName) {
    var data = fs.readFileSync(fileName, 'utf8');
    temp = data.split('\n');
    for (var i = 0; i < temp.length; i++) {
        uidList[0][i] = temp[i].split(',')[0];
        uidList[1][i] = temp[i].split(',')[1];
    }
    log('Loaded UID list from', fileName, logStatus);
}
function checkUidList(uid, email) {
    if (uidList[0].includes(uid)) {
        log('Matching  UID found...', "'" + email.trim() + "' === '" + uidList[1][uidList[0].indexOf(uid)].trim() + "'", logStatus);
        if (uidList[1][uidList[0].indexOf(uid)].trim() === email.trim()) {
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
function checkExistingVotes(uid, email) {
    return __awaiter(this, void 0, void 0, function () {
        var votes, uidHash, i, emailHash, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Checking existing votes');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, utils.pullVotes(topicId, tallyConfig.XAPIKEY, rp, logStatus)];
                case 2:
                    votes = _a.sent();
                    uidHash = security.hash(uid);
                    for (i = 0; i < votes.length; i++) {
                        if (votes[i].split('~')[0] === uidHash) {
                            emailHash = security.hash(email);
                            if (votes[i].split('~')[3] === emailHash)
                                return [2 /*return*/, true];
                            else
                                return [2 /*return*/, false];
                        }
                    }
                    return [2 /*return*/, true];
                case 3:
                    err_2 = _a.sent();
                    log('checkExistingVotes()', err_2, logStatus);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
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
    topicMemo = "" + electionId + specialChar + startDate.getTime() + specialChar + endDate.getTime();
}
/*
-------------------------------------------------------------------------
createTopic()
-------------------------------------------------------------------------
Calls upon the configureTopicMemo() and createTopicTransaction() functions to
create a new topic and store the new topic ID to `topicId`.
-------------------------------------------------------------------------
*/
function createTopic() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    log("createTopic()", "Creating New Topic...", logStatus);
                    log("ConsensusTopicCreateTransaction()", "waiting for new HCS Topic & mirror node (it may take a few seconds)", logStatus);
                    return [4 /*yield*/, HederaObj.createTopicTransaction(topicMemo)];
                case 1:
                    topicId = _a.sent();
                    log("createTopic()", "New Topic Created, ID = " + topicId, logStatus);
                    return [4 /*yield*/, sleep(9000)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    error_3 = _a.sent();
                    log("ERROR: createTopic() failed", error_3, logStatus);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*
-------------------------------------------------------------------------
connectTopic()
-------------------------------------------------------------------------
Prompts the user for the topic ID to connect to, checks if the length
of the topic ID is valid and creates a ConsensusTopicId from the
*/
function connectTopic() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer.prompt(connQuestions).then(function (answers) {
                        try {
                            var topicIdStr = answers.topic;
                            topicId = ConsensusTopicId.fromString(topicIdStr);
                            log("connectTopic()", "connected to " + topicIdStr, logStatus);
                        }
                        catch (error) {
                            log("ERROR: connectTopic() failed", error, logStatus);
                            process.exit(1);
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
init(); // process arguments & handoff to runChat()
