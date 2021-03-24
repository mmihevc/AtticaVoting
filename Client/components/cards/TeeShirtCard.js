import React from "react";
import {Box, CardMedia, Grid, Typography} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";


function TeeShirtCard(props) {

    return (
        <Box style={{position: "relative"}}>
            <Box width={275} height={350} onClick={props.handleSelectedCandidate} >
                <CardMedia
                    image={props.img} title={props.candidate.name}
                    style={{height: 345, width:'100%'}} onClick={() => props.handleSelectedCandidate()}
                />
            </Box>
            {
                props.checked ?
                    <Box width={50} height={50} boxShadow={2} bgcolor={"primary.main"} borderRadius={"50%"} style={{position: "absolute", top: -20, right: -20}}>
                        <Grid container style={{height: "100%"}}
                              justify={"center"} alignItems={"center"}
                        >
                            <CheckIcon />
                        </Grid>
                    </Box> : null
            }
        </Box>
    )
}

export default TeeShirtCard;