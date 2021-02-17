import React, {useEffect, useState} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {SnackbarProvider, useSnackbar} from 'notistack';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import {useHistory} from "react-router";

import Home from '../Client/components/Home'
import Confirmation from '../Client/components/Confirmation'
import DLInfo from '../Client/components/DLInfo'
import LoginLayout from "./components/LoginLayout";
import Login from "./components/Login"

const Router = props => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState();
    const [message, setMessage] = useState();
    const [sequence, setSequence] = useState();
    const [hash, setHash] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const history = useHistory();

    return (
        <Switch>
            <Route exact path="/">
                <LoginLayout>
                    <Login {...props} history={history} username={username} email={email}
                           setUsername={setUsername} setEmail={setEmail}
                    />
                </LoginLayout>
            </Route>
            <Route exact path="/home">
                <Home {...props} history={history} open={open} setOpen={setOpen}
                      setTopic={setTopic} setMessage={setMessage}
                      setSequence={setSequence} setHash={setHash}
                      history={history} username={username} email={email}
                />
            </Route>
            <Route path="/confirmation">
                <Confirmation {...props} open={open} setOpen={setOpen} history={history}
                              topic={topic} message={message} sequence={sequence} hash={hash}/>
            </Route>
            <Route path='/dlinfo'>
                <DLInfo {...props} open={open} setOpen={setOpen} />
            </Route>
        </Switch>
    )
}

const LoadApp = () =>
{
    const {enqueueSnackbar} = useSnackbar();
    const produceSnackBar = (message, variant = "error") => enqueueSnackbar(message, {variant: variant});

    return (
        <BrowserRouter>
            <Router produceSnackBar={produceSnackBar}/>
        </BrowserRouter>
    );
};

const App = () =>
{
    const theme = createMuiTheme({ palette: { primary: { main: '#CFB53B' }, secondary: {main: "#3232ff"}}});


    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <SnackbarProvider maxSnack={3} preventDuplicate>
                <LoadApp/>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;