import React, {useState} from "react";
import {
    AppBar, Toolbar, IconButton, Typography, Drawer, makeStyles, Divider, Link, Card, CardMedia, CardActionArea,
    CardContent, CardActions, Button, Grid
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft"
import clsx from 'clsx';
import candidateData from "../candidates.json";
import {useStyles} from '../static/constants'
import Navigation from "./Navigation";

function Home() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    return (
        <div className={classes.root}>
            <Navigation open={open} setOpen={setOpen}/>
            <DisplayCandidates open={open}/>
        </div>
    );

}


function DisplayCandidates(props) {

    function searchCandidateImage(name) {
        let candidateName = name.split(" ");

        let image = '../static/images/' + candidateName[0].toLowerCase() + '.jpg';
        return image;
    }

    const classes = useStyles();
    return (
        <main
            className={clsx(classes.content, {
                [classes.contentShift]: props.open,
            })}
        >
            <div className={classes.drawerHeader}/>
            <Grid container spacing={2}>
                {Object.values(candidateData).map((item, index) =>
                    <Grid item key={index}>
                        <CandidateCard {...props} name={item.name} description={item.description}
                                       link={searchCandidateImage(item.name)}/>
                    </Grid>
                )}
            </Grid>
        </main>

    )

}

function CandidateCard(props) {

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
                            <Typography gutterBottom variant="h5" component="h2">{props.name}</Typography>
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
                                <Button variant='contained'>VOTE</Button>
                            </CardActions>
                        </Grid>
                    </Grid>
                </CardContent>

            </Card>
        </div>

    )
}


export default Home;

