import React, {useEffect, useState} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {SnackbarProvider, useSnackbar} from 'notistack';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import {useHistory} from "react-router";

import Home from '../Client/components/Home'
import Confirmation from '../Client/components/Confirmation'
import DLInfo from '../Client/components/DLInfo'
import Candidate from "./components/Candidate";


const Router = props => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState();
    const [message, setMessage] = useState();
    const [sequence, setSequence] = useState();
    const [hash, setHash] = useState();
    const history = useHistory();

    return (
        <Switch>
            <Route exact path="/">
                <Home {...props} open={open} setOpen={setOpen}
                      setTopic={setTopic} setMessage={setMessage}
                      setSequence={setSequence} setHash={setHash}/>
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
    const theme = createMuiTheme({ palette: { primary: { main: '#1565c0' }, secondary: {main: "#D1B000"}}});


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