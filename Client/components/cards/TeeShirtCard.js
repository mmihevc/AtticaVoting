import React from "react";
import {Box, CardMedia, Grid} from "@material-ui/core";


function TeeShirtCard(props) {

    return (
        <Box width={300} height={350} boxShadow={1}>
                <CardMedia
                    component="img"
                    style={{height: 350, width:'100%'}}
                    image={props.img}
                    title={props.candidate.name}
                />
        </Box>
    )
}

export default TeeShirtCard;