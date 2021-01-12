import {Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography} from "@material-ui/core";
import candidateData from "../candidates.json";
import React from "react";

function Candidates(props) {

    function searchCandidateImage(name) {
        let candidateName = name.split(" ");

        let image = '../static/images/' + candidateName[0].toLowerCase() + '.jpg';
        return image;
    }

    return (
        <Grid container spacing={2} justify='center'
              alignItems='center' alignContent='center'>
            {Object.values(candidateData).map((item, index) =>
                <Grid item key={index}>
                    <CandidateCard {...props} name={item.name} description={item.description}
                                   link={searchCandidateImage(item.name)}/>
                </Grid>
            )}
        </Grid>
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

export default Candidates;