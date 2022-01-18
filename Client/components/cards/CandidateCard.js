import React from "react";
import { useSlopeCardMediaStyles } from '@mui-treasury/styles/cardMedia/slope';
import {Box, Grid, Typography, CardMedia} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import {useStyles} from "../../static/constants";

function CandidateCard(props) {
    const mediaStyles = useSlopeCardMediaStyles();
    const classes = useStyles();


  function handleSelectedCandidate() {
    props.setRaceItemSelection({
      ...props.raceItemSelection,
      [props.raceID]: props.candidate._id,
    });
  }

  

    return (
        <Box style={{position: "relative"}}>
            <Box width={275} height={350} border={props.checked ? 2 : undefined}
                 onClick={props.handleSelectedCandidate} className={props.checked ? undefined : classes.candidateCard}
                boxShadow={props.checked ? 3 : undefined}>
                    <CardMedia image={props.image} title={props.candidate.name} classes={mediaStyles}
                        style={{height: 300, width:'100%'}} onClick={() => handleSelectedCandidate()}/>
                <Grid container direction='column' justifyContent={'center'} alignItems='center'>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="h2" className='candidateName'>{props.candidate.name}</Typography>
                    </Grid>

                </Grid> 
            </Box>
            {
                props.checked ?
                    <Box width={50} height={50} bgcolor={"secondary.main"} border={2} borderRadius={"50%"} style={{position: "absolute", top: -20, right: -20}}>
                        <Grid container style={{height: "100%"}}
                              justifyContent={"center"} alignItems={"center"}
                        >
                            <CheckIcon/>
                        </Grid>
                    </Box> : null
            }
        </Box>
    )
}

export default CandidateCard;