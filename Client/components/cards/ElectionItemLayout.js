import React from 'react'
import { Box, Typography, Grid } from "@material-ui/core";
import { useStyles } from '../../static/constants'

function ElectionItemLayout(props) {
    const classes = useStyles();
  
    const text = (
      <Grid item lg={5}>
        <Box p={12}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item>
              <Typography align={props.align} variant="h3" className={classes.underline}>
                {props.title}
              </Typography>
            </Grid>
            <Grid item>
              <Typography align={props.align}>{props.description}</Typography>
              <Box pt={5}>
                <Typography align={props.align}>
                  You can click on the candidates to learn more
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    );
  
    const cards = (
      <Grid item lg={7}>
        <Box p={8}>
          <Grid container spacing={6} justifyContent={"center"}>
            {props.children}
          </Grid>
        </Box>
      </Grid>
    );
  
    return (
      <Grid container>
        {props.align === "right" ? cards : text}
        {props.align === "right" ? text : cards}
      </Grid>
    );
  }

export default ElectionItemLayout;