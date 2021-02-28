import React from "react";
import {useStyles, handleSelectedCandidate} from "../../static/constants";
import {Box, Button, Card, CardActions, CardContent, CardMedia, Grid} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

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

export default TeeShirtCard;