import React from 'react'
import { useSlopeCardMediaStyles } from '@mui-treasury/styles/cardMedia/slope';
import {Box, Grid, Typography, CardMedia} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import {useStyles} from "../../static/constants";

function ItemCard(props) {
    const classes = useStyles();

    

    function handleSelectedItem() {
        props.setItemClicked(true);
        props.setRaceItemSelection({
          ...props.raceItemSelection,
          [props.raceID]: props.item._id
        });
        props.setWinners({
            ...props.winners,
            [props.title]: props.item.name
        })
      }

    return (
        <Box style={{position: "relative"}}>
            <Box width={275} height={350} border={props.checked ? 2 : undefined}
                 onClick={props.handleSelectedCandidate} className={props.checked ? undefined : classes.candidateCard}
                boxShadow={props.checked ? 3 : undefined}>
                    <CardMedia image={props.image} 
                        style={{height: 300, width:'100%'}} onClick={() => handleSelectedItem()}/>
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

export default ItemCard;