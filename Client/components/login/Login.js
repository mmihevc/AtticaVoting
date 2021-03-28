import React, {useState} from 'react';

import {Button, Grid, InputAdornment, TextField, Typography} from "@material-ui/core";
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import '../../static/css/login.scss';


const Login = props => {


    function login() {
        props.history.push('/home');
    }

    return (
        <Grid
            container direction={"column"} justify={"center"} alignItems={"center"} alignContent={"center"}
            spacing={8}
        >
            <Grid item>
                <Typography variant={"h4"} align={"center"}>Welcome to Attica Voting</Typography>
            </Grid>
            <LoginFields
                username={props.username} setUsername={props.setUsername}
                email={props.email} setEmail={props.setEmail}
                login={login} {...props}
            />
            <Grid item container justify={"center"} alignItems={"center"} alignContent={"center"}>
                <Grid item style={{width: "80%"}} align={"center"}>
                    <Button
                        color={"primary"} variant={"contained"} style={{width: "80%", height: "50px"}}
                        onClick={() => {login()}}
                    >
                        Login
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

const LoginFields = props => {
    return(
        <Grid
            item container direction={"column"} justify={"center"} alignItems={"center"} alignContent={"center"}
            spacing={3} style={{width: '90%'}}
        >
            <Grid item style={{width: '100%'}}>
                <TextField
                    fullWidth color={"primary"} variant={"outlined"}
                    autoComplete={"username"} id={'username'}
                    label={"Name"} value={props.username} onChange={(e) => props.setUsername(e.target.value)}
                    onKeyDown={(e) =>
                    {
                        if(e.key === 'Enter') props.login();
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid item style={{width: '100%'}}>
                <TextField
                    fullWidth color={"primary"} variant={"outlined"}
                    type={"email"}  id={'email'}
                    label={"Email"} value={props.email} onChange={(e) => props.setEmail(e.target.value)}
                    onKeyDown={(e) =>
                    {
                        if(e.key === 'Enter') props.login();
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <EmailIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
        </Grid>
    );
}

export default Login;