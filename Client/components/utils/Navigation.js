import React from "react";
import {useStyles} from '../../static/constants'
import {AppBar, IconButton, Toolbar, Typography, Avatar, Button, Divider, Box, Link, Drawer, Grid} from "@material-ui/core";
import clsx from "clsx";
import {title} from '../../static/constants'
import {useHistory} from "react-router";
import AtticaLogo from '../../static/images/logo.jpg'
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";


function Navigation(props) {
    const classes = useStyles();
    return (
        <Box p={2}>
            <Grid container justify='space-between' alignItems='center'>
                <Grid item>
                    <IconButton style={{marginLeft: 'auto', backgroundColor: 'transparent'}} target="_blank" href='https://www.atticavoting.com/'>
                        <Avatar alt='Attica Logo' src={AtticaLogo} variant='rounded'/>
                        <Box pl={2}>
                            <Typography variant="h6" className={classes.underline} style={{color: 'black'}}>
                                {title}
                            </Typography>
                        </Box>
                    </IconButton>
                </Grid>
                <Grid item>

                </Grid>
            </Grid>
        </Box>
    )
}


function OldNavigation(props) {
    const classes = useStyles();
    const history = useHistory();

    return (
        <div>
            <AppBar position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: props.open,
                    })}>
                <Toolbar>
                    <Button onClick={() => history.push('/')}>
                        <Typography variant="h6" style={{color: 'white'}}>
                            {title}
                        </Typography>
                    </Button>
                    <IconButton style={{marginLeft: 'auto'}} target="_blank" href='https://www.atticavoting.com/'>
                        <Avatar alt='Attica Logo' src={AtticaLogo} variant='rounded'/>
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
                <Box pl={2} pt={2}>
                    <Link href='https://www.atticavoting.com/about' target="_blank" rel="noreferrer">About Attica</Link>
                </Box>
                <Box pl={2} pt={2}>
                    <Link onClick={() => history.push('dlinfo')}>Distributed Ledger Information</Link>
                </Box>
            </Drawer>
        </div>
    )
}

export default Navigation;