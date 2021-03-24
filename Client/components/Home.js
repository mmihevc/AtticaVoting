import React, {useEffect, useState} from 'react'
import {Box, Typography, Grid} from "@material-ui/core";
import '../static/css/global.scss'
import Navigation from "./Navigation";
import {sendGetRequest, sendPostRequest} from "../hooks/API";
import Confirmation from "./Confirmation";
import CandidateCard from "./cards/CandidateCard";
import {useStyles, presidentialDescription, teeShirtDescription} from "../static/constants";
import SubmitButton from "./SubmitButton";
import TeeShirtCard from "./cards/TeeShirtCard";


function Home(props) {
    const [votingStep, setVotingStep] = useState(0);

    if (votingStep === 0) {
        return <Voting {...props} setVotingStep={setVotingStep}/>

    }
    else {
        return <Confirmation {...props} votingStep={votingStep}/>
    }
}




function Voting(props) {
    const [candidateData, setCandidateData] = useState([]);
    const [selectedCandidates, setSelectedCandidates] = useState({});

    useEffect(() => {
        sendGetRequest().then(r => setCandidateData(shuffle(Object.values(r.data))))
    }, [])

    function shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function searchCandidateImage({ name }) {
        let candidateName = name.split(" ");
        return '/images/' + candidateName[0].toLowerCase() + '.jpg';
    }

    function handleVote() {
        props.setVotingStep(1);
        sendPostRequest('submit', {
            'candidatesChosen': props.selectedCandidates,
            'name' : props.username, 'email': props.email
        }).then(
            r => {
                if (r == null) {
                    props.produceSnackBar('Server error', 'error');
                }
                if (r.data.success) {
                    props.setVotingStep(2);
                    props.setTopic(r.data.topicId);
                    props.setHash(r.data.runningHash);
                    props.setMessage(r.data.message);
                    props.setSequence(r.data.sequence);
                } else {
                    props.produceSnackBar('Vote Failed', 'error')
                }
            })

    }

    function handleSelectedCandidate(candidate) {
        setSelectedCandidates({
            ...selectedCandidates,
            [candidate.position]: {name:candidate.name, description: candidate.description}
        });
    }

    function candidatesSelected(candidate) {
        if (selectedCandidates[candidate.position]) {
            if (selectedCandidates[candidate.position].name === candidate.name) {
                return true;
            }
        }
        return false;
    }


    return(
        <>
            <Navigation {...props}/>
            <Box width={"100vw"} height={"100vh"} style={{scrollBehavior: "smooth"}}>
                <Box width={"100%"} height={"100%"} style={{}}>
                    <Box minHeight={500} display={"flex"} flexDirection={"column"} bgcolor={"primary.main"}>

                    </Box>
                    <Box minHeight={626}>
                        <CandidateCardLayout align={"left"} title={"Presidential Race"}
                                             description={!selectedCandidates['presidentAndVicePresident'] ?
                                                 presidentialDescription : selectedCandidates['presidentAndVicePresident'].description}
                        >
                            {candidateData.filter(candidate => candidate.position === "presidentAndVicePresident")
                                .map((candidate, index) =>
                                    <Grid item key={index}>
                                        <CandidateCard
                                            {...props}
                                            candidate={candidate}
                                            img={searchCandidateImage(candidate)}
                                            checked={candidatesSelected(candidate)}
                                            handleSelectedCandidate={() => handleSelectedCandidate(candidate)}
                                        />
                                    </Grid>
                                )
                            }
                        </CandidateCardLayout>
                    </Box>
                    <WaveDivider />
                    <Box minHeight={626} bgcolor={"neutral.dark"}>
                        <CandidateCardLayout align={"right"} title={"TeeShirt Contest"} description={teeShirtDescription}>
                            {candidateData.filter((candidate) =>
                                candidate.position === 'teeshirt'
                            ).map((candidate, index) =>
                                <Grid item key={index} >
                                    <TeeShirtCard {...props}
                                                  candidate={candidate}
                                                  img={searchCandidateImage(candidate)}
                                                  checked={candidatesSelected(candidate)}
                                                  handleSelectedCandidate={() => handleSelectedCandidate(candidate)}
                                    />
                                </Grid>
                            )}
                        </CandidateCardLayout>
                    </Box>
                    <WaveDivider flip />
                    <Box minHeight={626}>
                    </Box>
                </Box>
            </Box>
            <SubmitButton {...props} onClick={() => handleVote()}/>
        </>
    );
}

function CandidateCardLayout(props) {
    const classes = useStyles();

    const text =
        <Grid item lg={5}>
            <Box p={12}>
                <Grid container direction={"column"} spacing={2}>
                    <Grid item>
                        <Typography align={props.align} variant='h3' className={classes.underline}>
                            {props.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography align={props.align}>
                            {props.description}
                        </Typography>
                        <Box pt={5}>
                            <Typography align={props.align}>
                                You can click on the candidates to learn more
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Grid>;

    const cards =
        <Grid item lg={7}>
            <Box p={8}>
                <Grid container spacing={6} justify='center'>
                    {props.children}
                </Grid>
            </Box>
        </Grid>;

    return(
        <Grid container>
            {props.align === "right" ? cards : text}
            {props.align === "right" ? text : cards}
        </Grid>
    )
}

const WaveDivider = props =>
{
    return(
        <Box color={"neutral.dark"} style={{transform: props.flip ? "matrix(1,0,0,-1,0,0)" : undefined}}>
            <svg style={{display: "block"}} viewBox="0 0 1440 100" preserveAspectRatio="none">
                <path className={"wave"} fill="currentColor" d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"/>
            </svg>
        </Box>
    )
}

export default Home;