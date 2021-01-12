import React from "react";
import {useStyles} from '../static/constants'
import {AppBar, Divider, Drawer, IconButton, Link, Toolbar, Typography} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {title} from '../static/constants'


function Navigation(props) {
    const classes = useStyles();

    return (
        <div>
            <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: props.open,
                    })}>
                <Toolbar>
                    <IconButton edge="start" style={{marginRight: 15}} onClick={() => props.setOpen(!props.open)}>
                        <MenuIcon style={{fill: '#C8C372'}}/>
                    </IconButton>

                    <Typography variant="h6">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={props.open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={() => props.setOpen(!props.open)}>
                        <ChevronLeftIcon/>
                    </IconButton>
                </div>
                <Divider/>
                <Link href='https://www.atticavoting.com/' target="_blank" rel="noreferrer">Attica Homepage</Link>
            </Drawer>
        </div>
    )
}

export default Navigation;