import React, {useState} from "react";
import {useStyles, electionDescription} from '../static/constants'
import Navigation from "./Navigation";
import Candidates from "./Candidates";
import {Grid, Typography} from "@material-ui/core";
import clsx from "clsx";

function Home() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <Navigation open={open} setOpen={setOpen}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
            >
                <div className={classes.drawerHeader}/>
            <Description />
            <Candidates open={open}/>
            </main>
        </div>
    );
}

function Description() {
    return (
        <div>
            <Grid container justify='center'
                  alignItems='center' alignContent='center'>
                <Typography>
                    {electionDescription}
                </Typography>
            </Grid>
        </div>
    )
}



export default Home;

