import React, {useState} from 'react';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';
import {Box, Button, Grid, Typography} from '@material-ui/core';
import clsx from "clsx";
import {motion} from "framer-motion"
import {useStyles, scale} from "../../static/constants";

function SubmitButton(props)
{
    const classes = useStyles(props);
    const [isOpen, setIsOpen] = useState(false);

    const variantsScale = {
        open: { borderRadius: "1px", scaleX: scale.x, scaleY: scale.y },
        closed: { borderRadius: "50px", scaleX: 1, scaleY: 1 }
    };

    return(
        <>
            <Box className={clsx(classes.fab, classes.fabWidth)}>
                <motion.div
                    animate={isOpen ? "open" : "closed"} variants={variantsScale}
                    style={{originX: 1, originY: 1}}
                    className={clsx(classes.fabBackground, classes.fabWidth)}
                />
            </Box>
            {
                isOpen ?
                    <Box className={clsx(classes.fab, classes.menuWidth)}>
                        <OpenButton isOpen={isOpen} setIsOpen={setIsOpen} {...props}/>
                    </Box> :
                    <Box className={clsx(classes.fab, classes.fabWidth)} onClick={() => setIsOpen(!isOpen)}>
                        <ClosedButton isOpen={isOpen} setIsOpen={setIsOpen}/>
                    </Box>
            }
        </>
    );
}

const ClosedButton = props =>
{
    const classes = useStyles();

    return(
        <Grid container style={{height: "100%"}}
              justify={"center"} alignItems={"center"}
        >
            <HowToVoteIcon className={classes.fabIcon} style={{color: 'white'}}/>
            <Typography className={classes.fabText}>Submit Vote</Typography>
        </Grid>
    )
}

const OpenButton = props =>
{
    const classes = useStyles();

    return (
        <Box display={"flex"} flexDirection={"column"} height={"100%"}
             alignItems={"center"} alignContent={"center"} justifyContent={"center"}
        >
            <Box>
                <Typography align={"center"} className={classes.menuText}>
                    This will submit your vote.
                </Typography>
                <Typography align={"center"} className={classes.menuText}>
                    Are you sure?
                </Typography>
            </Box>
            <Box mt={3} display={"flex"}>
                <OpenButtonButton
                    endIcon={<CancelIcon />}
                    className={classes.cancelButton}
                    onClick={() => props.setIsOpen(!props.isOpen)}
                >
                    Cancel
                </OpenButtonButton>
                <OpenButtonButton
                    endIcon={<CheckIcon />}
                    className={classes.confirmButton}
                    onClick={props.onClick}
                >
                    Confirm
                </OpenButtonButton>
            </Box>
        </Box>
    )
}

const OpenButtonButton = props =>
{
    return(
        <Box m={1}>
            <Button
                variant={"contained"}
                size={"large"}
                {...props}
            >
                {props.children}
            </Button>
        </Box>
    )
}

export default SubmitButton;