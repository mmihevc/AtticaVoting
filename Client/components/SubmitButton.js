import React from 'react';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import {Fab} from '@material-ui/core';
import {useStyles} from "../static/constants";

function SubmitButton(props) {
    const classes = useStyles();

    return (
        <Fab color="primary" onClick={props.onClick} className={classes.fab} >
            <HowToVoteIcon/>
        </Fab>
    )

}

export default SubmitButton;