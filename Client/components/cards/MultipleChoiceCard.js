import React, {useState} from "react";
import {useStyles} from "../../static/constants";
import {Box, Card, CardActions, CardContent, Collapse, FormControl, FormControlLabel, Grid, IconButton, RadioGroup, Typography, Radio} from "@material-ui/core";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

//TODO: implement a way to map choices
function MultipleChoiceCard(props) {
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();

    function handleAmendmentVote(e) {
        let vote = e.currentTarget.value ;
        props.setSelectedCandidates({
            ...props.selectedCandidates,
            [props.position]: vote === 'yes' ? 'yes' : 'no'
        });
    }

    return (
        <>
            <Card variant='elevation' style={{width:'300px'}}>
                <CardContent>
                    <Grid container justify='center'
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
                                justify="center"
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
                                <FormControl>
                                    <RadioGroup>
                                        <FormControlLabel control={<Radio />} label='' value=''/>
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </CardActions>
                    </Grid>
                </CardContent>
            </Card>
        </>
    )
}

export default MultipleChoiceCard;