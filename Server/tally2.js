let ballots = [];

let candidates = {
    president: ['alpha', 'bravo', 'charlie', 'delta'],
    speaker: ['whiskey', 'tango', 'foxtrot'],
    tshirt: ['a', 'b', 'c']
}

function main(){
    let ballots = generateBallots(10000);

    let races = sortBallots(ballots);

    console.log(ballots[0]);

    let presidentTally = tallyRCV(races.president.ballots, 0.5);

    // let speakerTally = tallyRCV(races.speaker.ballots, 0.5);

    // let tshirtTally = tallySPV(races.tshirt.ballots);

    console.log(presidentTally);
    // console.log(speakerTally);
    // console.log(tshirtTally);
}

function generateBallots(num){
    let retArr = [];
    for(let i = 0; i < num; i++){
        let ballot = {}
        ballot.president = randomRanking(candidates.president);
        ballot.speaker = randomRanking(candidates.speaker);
        ballot.tshirt = candidates.tshirt[Math.floor(Math.random() * 3)]
        retArr.push(ballot);
    }
    return retArr;
}

function randomRanking(cands){
    let retArr = [];
    let temp = [...cands];
    for(let i = cands.length; i > 0; i--){
        let index = Math.floor(Math.random() * i)
        retArr.push(temp[index])
        temp.splice(index, 1);
    }
    return retArr;
}

function sortBallots(ballots){
    let races = {};
    for (let key in ballots[0]){
        if(Array.isArray(ballots[0][key]))
            races[key] = {type: 'RCV', ballots: []}
        else
            races[key] = {type: 'SPV', ballots: []}
    }
    ballots.forEach((ballot) => {
        for (let key in ballot){
            races[key].ballots.push(ballot[key])
        }
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