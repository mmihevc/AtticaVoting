import React, {useState} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import {SnackbarProvider, useSnackbar} from 'notistack';
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {useHistory} from "react-router";

import OldHome from './components/old files/OldHome'
import DLInfo from './components/pages/DLInfo'
import LoginLayout from "./components/login/LoginLayout";
import Login from "./components/login/Login"
import Results from "./components/pages/Results";
import Home from "./components/pages/Home";
import {grey} from "@material-ui/core/colors";
import {CssBaseline} from "@material-ui/core";

const Router = props => {
    const [open, setOpen] = useState(false);
    const [topic, setTopic] = useState();
    const [message, setMessage] = useState();
    const [sequence, setSequence] = useState();
    const [hash, setHash] = useState();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [rankedChoice, setRankedChoice] = useState(false);
    const history = useHistory();

    return (
        <Switch>
            <Route exact path="/">
                <Home {...props} open={open} setOpen={setOpen}
                         setTopic={setTopic} setMessage={setMessage}
                         setSequence={setSequence} setHash={setHash}
                         history={history} username={username} email={email}
                         rankedChoice={rankedChoice} setRankedChoice={setRankedChoice}
                />
            </Route>
            <Route path='/learn-more'>
                <DLInfo {...props} open={open} setOpen={setOpen} />
            </Route>
            <Route path='/results'>
                <Results {...props}/>
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
    const theme = createMuiTheme({ palette: {
            primary: {main: '#0D72BA' },
            secondary: {main: "#C1912D"},
            neutral: { main: '#FFFFFF', light: grey[100], dark: grey[200] },}});


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