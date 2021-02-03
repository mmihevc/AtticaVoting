import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography, Box, IconButton, Collapse} from "@material-ui/core";
import candidateData from "../candidates.json";
import React, {useState} from "react";
import {useHistory} from "react-router";
import {sendPostRequest} from "../hooks/API";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useStyles} from "../static/constants";
import clsx from "clsx";


function Candidate(props) {
    function searchCandidateImage(name) {
        let candidateName = name.split(" ");
        return '../../Server/public/images/' + candidateName[0].toLowerCase() + '.jpg';
    }

    return (
        <Grid container spacing={2} justify='center'
              alignItems='center' alignContent='center'>
            {Object.values(candidateData).map((item, index) =>
                <Grid item key={index}>
                    <CandidateCard {...props} name={item.name} position={item.position} description={item.description}
                                   link={searchCandidateImage(item.name)}/>
                </Grid>
            )}
        </Grid>
    )
}



function CandidateCard(props) {
    const history = useHistory();
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);

    function handleVote() {
        sendPostRequest('submit', {'candidateName': props.name}).then(
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
                    history.push('/confirmation');
                }
                else {
                    props.produceSnackBar('Vote Failed', 'error')
                }

            }
        )
    }

    return (
        <div style={{maxWidth: 345}}>
            <Card variant='elevation'>
                <CardMedia
                    component="img"
                    style={{height: 300}}
                    image={props.link}
                    title='candidate image'
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
                                        {props.position}
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
                                    <Button variant='contained'
                                            color='primary'
                                            onClick={() => {handleVote()}}
                                            className='voteButton'
                                    >
                                        VOTE
                                    </Button>
                                </Box>
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
        </div>
    )
}


export default Candidate;