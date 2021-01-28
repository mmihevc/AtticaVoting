import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography, Box} from "@material-ui/core";
import candidateData from "../candidates.json";
import React from "react";
import {useHistory} from "react-router";
import {sendPostRequest} from "../hooks/API";


function Candidate(props) {

    function searchCandidateImage(name) {
        let candidateName = name.split(" ");
        let image = '../static/images/' + candidateName[0].toLowerCase() + '.jpg';
        return image;
    }

    return (
        <Grid container spacing={2} justify='center'
              alignItems='center' alignContent='center'>
            {Object.values(candidateData).map((item, index) =>
                <Grid item key={index}>
                    <CandidateCard {...props} name={item.name} description={item.description}
                                   link={searchCandidateImage(item.name)}/>
                </Grid>
            )}
        </Grid>
    )
}





function CandidateCard(props) {
    const history = useHistory();

    function handleVote() {
        sendPostRequest('submit', {'candidateName': props.name}).then(
            r => {
                if (r.data.success) {
                    props.produceSnackBar('Vote Submitted', 'info');
                    props.setTopic(r.data.topicId);
                    props.setHash(r.data.runningHash);
                    props.setMessage(r.data.message)
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
                            <CardActionArea>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {props.description}
                                </Typography>
                            </CardActionArea>
                        </Grid>
                        <Grid item>
                            <CardActions>
                                <Box pt={2}>
                                    <Button variant='contained'
                                            color='primary'
                                            onClick={() => {handleVote(); history.push('/confirmation')}}
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