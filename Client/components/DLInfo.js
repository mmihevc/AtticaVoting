import React from 'react'
import Navigation from "./Navigation";
import {useStyles} from "../static/constants";
import clsx from "clsx";

function DLInfo(props) {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Navigation {...props} open={props.open} setOpen={props.setOpen}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: props.open,
                })}
            >
                <div className={classes.drawerHeader}/>
            </main>

        </div>
    )
}

export default DLInfo;