import React, {useEffect, useState} from "react";
import {useStyles, electionDescription} from '../static/constants'
import CandidateCard from "./cards/CandidateCard";
import {Grid, Typography, Box, Button} from "@material-ui/core";
import {sendGetRequest, sendPostRequest} from "../hooks/API";
import Navigation from "./Navigation";
import TeeShirtCard from "./cards/TeeShirtCard";
import AmendmentCard from "./cards/AmendmentCard";
import RankedCandidateCard from "./cards/RankedCandidateCard";


function Home(props) {
    const classes = useStyles();
    const [candidateData, setCandidateData] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});

    useEffect(() => {
        sendGetRequest().then(
            r => {
                setCandidateData(shuffle(Object.values(r.data)))
            }
        )
    }, [])

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function searchCandidateImage(name) {
        let candidateName = name.split(" ");
        return '/images/' + candidateName[0].toLowerCase() + '.jpg';

    }

    function handleVote() {
        props.produceSnackBar('Processing votes. Please wait', 'info');
        sendPostRequest('submit', {'candidatesChosen': selectedCandidates,
            'name' : props.username, 'email': props.email}).then(
            r => {
                if (r == null) {
                    props.produceSnackBar('Server error', 'error');
                }
                if (r.data.success) {
                    props.produceSnackBar('Vote Submitted', 'info');
                    props.setTopic(r.data.topicId);
                    props.setHash(r.data.runningHash);
                    props.setMessage(r.data.message);
                    props.setSequence(r.data.sequence);
                    props.history.push('/confirmation');
                }
                else {
                    props.produceSnackBar('Vote Failed', 'error')
                }
            }
        )
    }

    return (
        <div className={classes.root}>
            <Box pt={5}>
                <Navigation {...props}/>
                <Description />
                <Grid container spacing={5} justify='center'
                      alignItems='center' alignContent='center'>
                    <DisplayHeadings {...props} heading={"Presidential Candidate"}/>
                    {candidateData.filter((item) =>
                        item.position === "presidentAndVicePresident"
                    ).map((item, index) =>
                        <Grid item key={index}>
                            <RankedCandidateCard {...props} name={item.name} position={item.position}
                                                 description={item.description}
                                                 setSelectedCandidates={setSelectedCandidates}
                                                 selectedCandidates={selectedCandidates}
                                                 link={searchCandidateImage(item.name)}/>
                        </Grid>
                    )}
                    <DisplayHeadings {...props} heading={"Speaker of the Senate Candidate"}/>
                    {candidateData.filter((item) =>
                        item.position === "speakerOfTheSenate"
                    ).map((item, index) =>
                        <Grid item key={index}>
                            <CandidateCard {...props} name={item.name} position={item.position}
                                           description={item.description}
                                           setSelectedCandidates={setSelectedCandidates}
                                           selectedCandidates={selectedCandidates}
                                           link={searchCandidateImage(item.name)}/>
                        </Grid>
                    )}
                    <DisplayHeadings {...props} heading={"T-Shirt"}/>
                    {candidateData.filter((item) =>
                        item.position === 'teeshirt'
                    ).map((item, index) =>
                        <Grid item key={index} >
                            <TeeShirtCard {...props} name={item.name} position={item.position} description={item.description}
                                          setSelectedCandidates={setSelectedCandidates} selectedCandidates={selectedCandidates}
                                          link={searchCandidateImage(item.name)} />
                        </Grid>
                    )}
                    <DisplayHeadings {...props} heading={"ASCSU Constitution Amendments"}/>
                    {candidateData.filter((item) =>
                        item.position.includes('amendment')
                    ).map((item, index) =>
                        <Grid item key={index}>
                            <AmendmentCard {...props} name={item.name} position={item.position}
                                           description={item.description} setSelectedCandidates={setSelectedCandidates}
                                           selectedCandidates={selectedCandidates}
                                           link={searchCandidateImage(item.name)}/>
                        </Grid>
                    )}
                    <Grid container justify='center' alignItems='center' alignContent='center'>
                        <Box pt={3} pb={3}>
                            <Button onClick={() => handleVote()} variant="contained" color='primary'>
                                Submit Votes
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

        </div>

    )
}

function Description() {
    return (
        <div>
            <Box pb={4} pt={3}>
                <Grid container justify='center'
                      alignItems='center' alignContent='center'>
                    <Typography variant="h5">
                        {electionDescription}
                    </Typography>
                </Grid>
            </Box>
        </div>
    )
}

function DisplayHeadings(props) {
    return (
        <>
            <Grid container spacing={2} justify='center'
                  alignItems='center' alignContent='center'>
                <Box pt={5} pb={3}>
                    <Typography variant='h4' style={{ textDecoration: 'underline #CFB53B'}}>{props.heading}</Typography>
                </Box>
            </Grid>
        </>
    )
}

export default Home;

