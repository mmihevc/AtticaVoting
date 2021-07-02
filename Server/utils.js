/*
-------------------------------------------------------------------------
Initialization questions for inquirer prompts
-------------------------------------------------------------------------
 */

export let initQuestions = [
  createPromptObject('list', 'status', 'What logging mode do you want to run in?', ['Default', 'Minimal', 'Debug'], function(val){return val.toLowerCase();}),
  createPromptObject('input', 'account', 'What\'s your account ID? [empty will default to the value in config.js]\n'),
  createPromptObject('password', 'key', 'What\'s your private key? \n[empty will default to the value in config.js]\n'),
  createPromptObject('list', 'start', 'Should we create a new topic, or connect to an existing one?', ['Start new election', 'Continue an on-going election'], function(val){return val.toLowerCase();})
];

/*
-------------------------------------------------------------------------
Tallying questions for inquirer prompts
-------------------------------------------------------------------------
 */
export let tallyQuestions = [
  createPromptObject('input', 'account', 'What\'s your account ID? [empty will default to the value in config.js]\n'),
  createPromptObject('password', 'key', 'What\'s your private key? \n[empty will default to the value in config.js]\n'),
  createPromptObject('input', 'topic', 'Please enter the topic ID of the election\n'),
  createPromptObject('password', 'pass', 'What\'s the password to unlock the votes?\n'),
];

export let connectQuestions = [
  createPromptObject('input', 'topic', 'Please enter the topic ID of the election\n')
];

/*
-------------------------------------------------------------------------
createPromptObject()
-------------------------------------------------------------------------
*/

/*function createPromptObject(type, name, message){
  let obj = {
    type: type,
    name: name,
    message: message
  };

  return obj;
}*/

export function createPromptObject(type, name, message, choices, filter) {
  let obj = {
    type: type,
    name: name,
    message: message,
    choices: choices,
    filter: filter
  };

  return obj;
}

/*
-------------------------------------------------------------------------
UInt8ToString(array)
-------------------------------------------------------------------------
Inputs: array
Outputs: String
-------------------------------------------------------------------------
Takes an unsigned array of integers and converts it to a string.
-------------------------------------------------------------------------
 */
export function UInt8ToString(array) {
  let str = "";
  for (let i = 0; i < array.length; i++) {
    str += array[i];
  }
  return str;
}

/*
-------------------------------------------------------------------------
secondsToDate(time)
-------------------------------------------------------------------------
Inputs: time (seconds)
Outputs: time (date( year, Month, Date))
-------------------------------------------------------------------------
This is a helper function that changes seconds to date
-------------------------------------------------------------------------
 */
export function secondsToDate(time) {
  let date = new Date(1970, 0, 1);
  date.setSeconds(time.seconds);
  return date;
}

/*
-------------------------------------------------------------------------
sleep(ms)
-------------------------------------------------------------------------
Inputs: milliseconds
-------------------------------------------------------------------------
This is a helper function that holds the program for the passed amount of
ms
-------------------------------------------------------------------------
*/
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
-------------------------------------------------------------------------
handleLog()
-------------------------------------------------------------------------
Inputs: event, log, status
-------------------------------------------------------------------------
This is a helper function that logs  events
-------------------------------------------------------------------------
 */
export function handleLog(event, log, status) {
  if (status === "debug") {
    console.log(`${event} ${log}`);
  } else if (status === "minimal") {
    console.log(`${event}`);
  } else if (status === "default") {
    if (event === "createTopic()" ||
        event === "runServer()" ||
        event === "") {
      console.log(`> ${log}`);
    } else if (event === "ConsensusSubmitMessageTransaction()") {
      console.log(`Submitting message: ${log}`);
    }
  } else {
    console.log('ERROR: Unknown logging status');
    process.exit(1);
  }
}

// function handleLog(event, log, status) {
//   if (status === "default") {
//     console.log(`${event} ${log}`);
//   } else if (status === "minimal") {
//     console.log(event);
//   } else {
//     // debug mode. destructure mirror receipts or print a usual log
//     if (log.toString() !== log && log["runningHash"] !== undefined) {
//       console.log(event);
//       console.log("\t message: " + log.toString());
//       console.log("\t runningHash: " + UInt8ToString(log["runningHash"]));
//       console.log(
//         "\t consensusTimestamp: " + secondsToDate(log["consensusTimestamp"])
//       );
//     } else {
//       console.log(event + " " + log);
//     }
//   }
// }

/* FIXME: Comments needed */
export function populateCandidates(){
  // const Candidate = require("./CandidateCard").Candidate;
  // let candidates = require("./electionConfig.js").electionConfig['candidates'];
  let retArr = new Array(candidates.length);
  for(let i = 0; i < candidates.length; i++) {
    retArr[i] = new Candidate(candidates[i]['name'], candidates[i]['desc'], candidates[i]['img']);
  }

  return retArr;
}

/*
-------------------------------------------------------------------------
pullVotes()
this is the helper function that communicates with the Dragon Glass API
and then stores all the votes within the votes array.
-------------------------------------------------------------------------
 */
export async function pullVotes(topicId, apiKey, rp, logStatus) {
  try{ 
    let options = {
        uri: `https://api-testnet.dragonglass.me/hedera/api/hcs/messages?topicID=${topicId}`,
        port: 443,
        method: 'GET',
        headers: {'X-API-KEY': apiKey}
    };

    let response = await sendRequest(options, rp, logStatus);

    return hexConvertVotes(response);
  } catch (err) {
    handleLog('pullVotes()', err, logStatus);
  }
}

export async function sendRequest (options, rp, logStatus) {
  let response;
  try {
      await rp(options)
          .then(function (res) {
              response = JSON.parse(res);
          })
          .catch(function (err) {
              log("tally.js sendRequest()", err, logStatus);
              sendRequest(options, rp);
          });
  } catch (error) {
      handleLog("pullVotes()", error, logStatus);
  }

  return response.data;
}

export function hexConvertVotes (data) {
  let votes = [];
  for (let i = 0; i < data.length; i++) {
      votes[i] = hexToStr(data[i].message);
  }
  return votes;
}

export const convert = (from, to) => str => Buffer.from(str, from).toString(to);

export const hexToStr = convert('hex', 'utf8');


