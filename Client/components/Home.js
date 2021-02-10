import React, {useEffect, useState} from "react";
import {useStyles, electionDescription} from '../static/constants'
import Navigation from "./Navigation";
import Candidate from "./Candidate";
import {Grid, Typography, Box} from "@material-ui/core";
import clsx from "clsx";


function Home(props) {
    const classes = useStyles();


    return (
        <div className={classes.root}>
            <Navigation {...props}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: props.open,
                })}
            >
                <div className={classes.drawerHeader}/>
            <Description />
            <Candidate {...props} history={props.history}/>
            </main>
        </div>
    );
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



export default Home;

