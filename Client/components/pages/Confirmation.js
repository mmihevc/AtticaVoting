import React, {useEffect, useRef, useState} from "react";
import Navigation from "../utils/Navigation";
import {Grid, Box, Typography, Hidden, Button} from "@material-ui/core";
import vote from '../../static/images/voting.gif';
import finish from '../../static/images/finish.jpg'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TypeWriterEffect from 'react-typewriter-effect';

function Confirmation(props) {

    return (
        <>
            <Navigation {...props}/>
            <Grid container direction="row" alignItems="center">
                <Hidden mdDown>
                    <Grid item lg={6}>
                        <Box p={2}>
                            <img
                                src={props.votingStep !== 2 ? vote : finish}
                                title='voting-image'
                                style={{width:'80%'}}
                            />
                        </Box>
                    </Grid>
                </Hidden>
                {props.votingStep === 1 ? <DisplayProcessing/> : <DisplaySubmitted /> } 
                {props.votingStep === 2 ? <LearnMore icon={ArrowForwardIosIcon}/> : null}
            </Grid>
        </>
    )


}

function DisplayProcessing() {
    return (
        <>
            <TypeWriterEffect
                multiText={[
                    "Processing",
                    "Please Wait"
                ]}
                typeSpeed={75}
                multiTextDelay={500}
                cursorColor={'#C8C372'}
            />
        </>
    )
}

function DisplaySubmitted() {
    return (
            <TypeWriterEffect
                text={"Submitted, thank you for voting!"}
                typeSpeed={50}
                cursorColor={'#C8C372'}
            />
    )
}

const LearnMore = props =>
{
    const Icon = props.icon;

    return(
        <Button
            style={{height: 50, borderRadius: 8, textTransform: 'none'}}>
            <Box p={2}>
                <Grid container spacing={4}
                      alignItems={"center"} alignContent={"center"}
                >
                    <Grid item>
                        <Typography variant='h6'>Learn More</Typography>
                    </Grid>
                    <Icon color="primary"/>
                </Grid>
            </Box>
        </Button>
    )

}


export default Confirmation;