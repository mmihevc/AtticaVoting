import React from "react";
import { useSlopeCardMediaStyles } from '@mui-treasury/styles/cardMedia/slope';
import {Box, Grid, Typography, CardMedia} from "@material-ui/core";

function CandidateCard(props) {
    let rank = '';
    const mediaStyles = useSlopeCardMediaStyles();

    function handleRankedVote(e) {
        rank = e.target.value;
        props.setSelectedCandidates({
            ...props.selectedCandidates,
            [props.position]: [props.name, rank]
        });
    }

    return (
        <Box width={300} height={350} boxShadow={1} onClick={props.handleSelectedCandidate} >
            <CardMedia image={props.img} title={props.candidate.name} classes={mediaStyles} style={{height: 300, width:'100%'}}/>
            <Grid container direction='column'
                  justify='center' alignItems='center'
            >
                <Grid item>
                    <Typography gutterBottom variant="h5" component="h2" className='candidateName'>{props.candidate.name}</Typography>
                </Grid>

            </Grid>
        </Box>
    )
}

export default CandidateCard;