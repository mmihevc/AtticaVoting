import {Card, CardActions, CardContent, CardMedia, Grid, Typography, Box, IconButton, Collapse, Button, FormControl, InputLabel, Select, MenuItem} from "@material-ui/core";
import React, {useState} from "react";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useStyles} from "../../static/constants";
import clsx from "clsx";

//TODO: implement a way to map choices
function RankedCandidateCard(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    let rank = '';
    const temp = props.position.replace( /([A-Z])/g, " $1" );
    const position = temp.charAt(0).toUpperCase() + temp.slice(1);

    function handleRankedVote(e) {
        rank = e.target.value;
        props.setSelectedCandidates({
            ...props.selectedCandidates,
            [props.position]: [props.name, rank]
        });
    }

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
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-label">Rank</InputLabel>
                                         <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            color='primary'
                                            value={rank}
                                            onChange={(event) => handleRankedVote(event)}
                                        >
                                            <MenuItem value={1}>1st</MenuItem>
                                            <MenuItem value={2}>2nd</MenuItem>
                                            <MenuItem value={3}>3rd</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
        </div>
    )
}


export default RankedCandidateCard;