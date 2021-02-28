import React from "react";
import Navigation from "./Navigation";
import {CardMedia, Grid, Box, Typography, IconButton} from "@material-ui/core";
import vote from '../static/images/voting.gif';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import '../static/css/processing.scss';

function Processing(props) {

    return (
            <div>
                <Navigation {...props}/>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Box pl={'50px'} pt={'100px'}>
                        <Grid item xs={12}>
                            <CardMedia
                                component="img"
                                image={vote}
                                title='voting-image'
                            />
                        </Grid>
                    </Box>

                        <Grid item xs={6}>
                            <Typography variant='h2' className='typewriter'>Processing.</Typography>
                            <Typography variant='h4'>
                                Please | Wait
                            </Typography>
                            <Typography variant='h6'>
                                Learn More <IconButton><ArrowRightIcon/></IconButton>
                            </Typography>
                        </Grid>


                </Grid>
            </div>
    )
}

export default Processing;