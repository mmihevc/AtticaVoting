import HederaClass from './hedera.js';
import {client} from './db.js';

import "dotenv/config"

function wait(ms){ return new Promise(res => setTimeout(res, ms))};

async function main(){
    await client.connect();

    let hClient = new HederaClass(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY, process.env.NODE_ENV === 'development' ? "default" : "debug");
    let election = await client.db('Attica').collection('Election').findOne({'title': "CSU"});
    let topicID = election.topicID;

    let ballots = await hClient.pullHCSMessages(topicID);
    await wait(1000);
    console.log(`Ballots received!`);
    //console.log(ballots);

    let races = sortBallots(ballots);
    //console.log(races);

    let results = tallyAll(races);
    console.log(results);

    let winners = pickWinner(results);
    console.log(winners);

    process.exit(1);
}

function tallyAll(races){
    let results = {}
    for(let key in races){
        if(races[key].ballotType == "SPV")
            results[key] = tallySPV(races[key].votes);
        else
            results[key] = tallyRCV(races[key].votes, 0.5)
    }

    return results;
}

function pickWinner(results){
    let winners = {}
    for(let key in results){
        let top = {name: '', count: 0}
        for(let cand in results[key]){
            if(results[key][cand] > top.count)
                top = {name: cand, count: results[key][cand]}
        }
        winners[key] = top;
    }
    return winners;
}

function sortBallots(ballots){
    let races = {};
    ballots.forEach((ballot) => {
        ballot.forEach((vote) => {
            if(races[vote.raceName] == undefined)
                races[vote.raceName] = {
                    raceName: vote.raceName,
                    ballotType: vote.ballotType,
                    votes: []
                }
            races[vote.raceName].votes.push(vote.winners);
        });
    });
    return races;
}

function tallyRCV(ballots, majority){
    let top = 0;
    let count = ballots.length;

    let temp = [...ballots]
    
    let bounds = countBoundaries(temp);
    while(bounds.top.count < Math.floor(count*majority)){
        console.log(`Majority Not Achieved\nEliminating: ${bounds.bot.name}`);
        temp.forEach((ballot) => {
            let pos = ballot.indexOf(bounds.bot.name);
            if(pos != -1)
                ballot.splice(pos, 1);
        });
        bounds = countBoundaries(temp);
    }
    return bounds.top;
}

function countBoundaries(ballots){
    let tally = {};
    ballots.forEach((ballot) => {
        if(tally[ballot[0]] == undefined)
            tally[ballot[0]] = 1;
        else
            tally[ballot[0]] += 1;
    });
    let bounds = {}
    for (let key in tally){
        if(bounds.top == undefined)
            bounds.top = {name: key, count: tally[key]};
        if(bounds.bot == undefined)
            bounds.bot = {name: key, count: tally[key]};
        if(bounds.top.count < tally[key])
            bounds.top = {name: key, count: tally[key]};
        if(bounds.bot.count > tally[key])
            bounds.bot = {name: key, count: tally[key]};
    }
    return bounds;
}

function tallySPV(votes){
    let tally = {};
    votes.forEach((vote) => {
        if(tally[vote] == undefined)
            tally[vote] = 1;
        else
            tally[vote] += 1;
    });
    return tally;
}

main();