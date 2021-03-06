import React, {useState} from "react";
import {useStyles} from "../../static/constants";
import {Box, Button, Card, CardActions, CardContent, Collapse, Grid, IconButton, Typography} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";

function AmendmentCard(props) {

    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();
   // const displayCheck = props.selectedCandidates[props.position] === props.name;

    /*function handleAmendmentVote(e) {
        let vote = e.currentTarget.value ;
        props.setSelectedCandidates({
            ...props.selectedCandidates,
            [props.position]: vote === 'yes' ? 'yes' : 'no'
        });
    }*/

    return (
        <p>
            Amendment Card
        </p>
    )

    /*return (
        <>
            <Card variant='elevation' style={{width:'300px'}}>
                <CardContent>
                    <Grid container justifyContent={'center'}
                          alignItems='center' alignContent='center' direction='column'>
                        <Grid item>
                            <Typography gutterBottom variant="h5" component="h2" className='candidateName'>{props.name}</Typography>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <>
                            <Grid
                                container
                                direction="row"
                                justifyContent={"center"}
                                alignItems="center"
                            >
                                <Typography>Click to learn more</Typography>
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
                        <CardActions style={{justifyContent: 'center'}}>
                            <Box pt={2}>
                                {!displayCheck ?
                                    <>

                                        <Button variant='contained'
                                                color='primary'
                                                value='yes'
                                                style={{marginRight: '10px'}}
                                                onClick={(e) => handleAmendmentVote(e)}
                                        >
                                            YES
                                        </Button>
                                        <Button variant='contained'
                                                color='primary'
                                                value='no'
                                                onClick={(e) => handleAmendmentVote(e)}>
                                            NO
                                        </Button>
                                    </>
                                    : <CheckIcon/>
                                }
                            </Box>
                        </CardActions>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )*/
}

export default AmendmentCard;