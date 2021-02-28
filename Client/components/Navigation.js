import React from "react";
import {useStyles} from '../static/constants'
import {AppBar, IconButton, Toolbar, Typography, Avatar, Button} from "@material-ui/core";
import clsx from "clsx";
import {title} from '../static/constants'
import {useHistory} from "react-router";
import AtticaLogo from '../static/images/atticaLogo.jpg'


function Navigation(props) {
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
        </div>
    )
}

export default Navigation;