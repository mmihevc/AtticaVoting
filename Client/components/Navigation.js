import React from "react";
import {useStyles} from '../static/constants'
import {AppBar, Divider, Drawer, IconButton, Link, Toolbar, Typography, Avatar, Box} from "@material-ui/core";
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
                    <IconButton style={{marginLeft: 'auto'}} target="_blank" href='https://www.atticavoting.com/'>
                        <Avatar alt='Attica Logo' src='../static/images/atticaLogo.jpg' variant='rounded'/>
                    </IconButton>
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
                <Box pl={2}>
                    <Link href='https://www.atticavoting.com/about' target="_blank" rel="noreferrer">About Attica</Link>
                </Box>
            </Drawer>
        </div>
    )
}

export default Navigation;