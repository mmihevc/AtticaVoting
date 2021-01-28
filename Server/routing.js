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
    console.log('DEBUG: / get request');
    res.redirect('/ballot'); //TEMP
});

router.get('/ballot', (req, res) => {
    console.log('DEBUG: /ballot get request');
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