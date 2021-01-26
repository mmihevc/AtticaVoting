const express = require('express');
const router = express.Router();
const {
    sendHCSMessage,
    subscribeToMirror,
    createTopicTransaction,
    configureAccount
} = require('./hedera');

router.get('/', (req, res) => {
    // SAML Login Redirect
    res.redirect('/ballot'); //TEMP
});

router.get('/ballot', (req, res) => {
    res.sendFile('/index.html');
});

router.post('/submit', (req, res) => {
    console.log(req.body.vote);
    res.redirect('/confirmation');
});

router.get('/confirmation', (req, res) => {
    res.sendFile('/confirmation');
});

module.exports = router;