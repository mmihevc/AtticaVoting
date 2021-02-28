import {Card, CardActions, CardContent, CardMedia, Grid, Typography, Box, IconButton, Collapse, Button} from "@material-ui/core";
import React, {useState} from "react";
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {handleSelectedCandidate, useStyles} from "../../static/constants";
import clsx from "clsx";



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





export default CandidateCard;