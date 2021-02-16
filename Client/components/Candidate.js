import {Card, CardActions, CardContent, CardMedia, Grid, Typography, Box, IconButton, Collapse, Checkbox, Button} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import CheckIcon from '@material-ui/icons/Check';
import {sendPostRequest, sendGetRequest} from "../hooks/API";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useStyles} from "../static/constants";
import clsx from "clsx";


function Candidate(props) {
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
        <Grid container spacing={2} justify='center'
              alignItems='center' alignContent='center'>
            <DisplayHeadings {...props} heading={"Presidential Candidate"}/>
                {candidateData.filter((item) =>
                    item.position === "presidentAndVicePresident"
                ).map((item, index) =>
                    <Grid item key={index}>
                        <CandidateCard {...props} name={item.name} position={item.position}
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
            <DisplayHeadings {...props} heading={"TeeShirt"}/>
            {candidateData.filter((item) =>
                item.position === 'teeshirt'
            ).map((item, index) =>
                <Grid item key={index} >
                    <TeeShirtCard {...props} name={item.name} position={item.position} description={item.description}
                                  setSelectedCandidates={setSelectedCandidates} selectedCandidates={selectedCandidates}
                                  link={searchCandidateImage(item.name)} />
                </Grid>
            )}
                <Grid container justify='center' alignItems='center' alignContent='center'>
                    <Box pt={3}>
                        <Button onClick={() => handleVote()} variant="contained" color='primary'>
                            Submit Votes
                        </Button>
                    </Box>
                </Grid>
        </Grid>

    )
}

function DisplayHeadings(props) {
    return (
        <>
            <Grid container spacing={2} justify='center'
                  alignItems='center' alignContent='center'>
                <Box pt={5} pb={3}>
                    <Typography variant='h4'>{props.heading}</Typography>
                </Box>
            </Grid>
        </>
    )
}

function handleSelectedCandidate(props) {
    props.setSelectedCandidates({
        ...props.selectedCandidates,
        [props.position]: props.name
    });
}

function CandidateCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const temp = props.position.replace( /([A-Z])/g, " $1" );
    const position = temp.charAt(0).toUpperCase() + temp.slice(1);
    const displayCheck = props.selectedCandidates[props.position] === props.name;


    return (
        <div>
            <Card variant='elevation'>
                <CardMedia
                    component="img"
                    style={{height: 300}}
                    image={props.link}
                    title='candidate image'
                    className={classes.candidateImg}
                />
                <CardContent>
                    <Grid container justify='center'
                          alignItems='center' alignContent='center' direction='column'>
                        <Grid item>
                            <Typography gutterBottom variant="h5" component="h2" className='candidateName'>{props.name}</Typography>
                        </Grid>
                        <Grid item>
                            <>
                                <Grid
                                    container
                                    direction="row"
                                    justify="center"
                                    alignItems="center"
                                >
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {position}
                                    </Typography>
                                    <IconButton
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: expanded,
                                        })}
                                        onClick={() => {setExpanded(!expanded)}}
                                        aria-expanded={expanded}
                                        aria-label="show more"
                                    >
                                        <ExpandMoreIcon/>
                                    </IconButton>
                                </Grid>
                            </>
                            <Collapse in={expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    <Typography ariant="body2" color="textSecondary" component="p">
                                        {props.description}
                                    </Typography>
                                </CardContent>
                            </Collapse>
                        </Grid>
                        <Grid item>
                            <CardActions>
                                <Box pt={2}>
                                    {!displayCheck ?
                                        <Button variant='contained'
                                                color='primary'
                                                className='voteButton'
                                                onClick={() => handleSelectedCandidate(props)}
                                        >
                                            VOTE
                                        </Button> : <CheckIcon/>
                                    }
                                </Box>
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
        </div>
    )
}




function TeeShirtCard(props) {
    const displayCheck = props.selectedCandidates[props.position] === props.name;
    const classes = useStyles();
    return (
        <>
            <Card variant='elevation'>
                <CardMedia
                    component="img"
                    style={{height: 300}}
                    image={props.link}
                    title='teeshirt image'
                    className={classes.candidateImg}
                />
                <CardContent>
                    <Grid container justify='center'
                          alignItems='center' alignContent='center' direction='column'>
                        <Grid item>
                            <CardActions>
                                <Box pt={2}>
                                    {!displayCheck ?
                                        <Button variant='contained'
                                                color='primary'
                                                className='voteButton'
                                                onClick={() => handleSelectedCandidate(props)}
                                        >
                                            VOTE
                                        </Button> : <CheckIcon/>
                                    }
                                </Box>
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

function constitutionAmendmentCard() {

}


export default Candidate;