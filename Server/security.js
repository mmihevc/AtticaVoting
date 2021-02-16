/* imports */
const openpgp = require('openpgp');
const crypto = require('crypto');
const fsp = require('fs').promises;

const config = require('./config/config.js').securityConfig;
const pubKeyFile = './Server/config/' + config.pub;
const privKeyFile = './Server/config/' + config.priv;

/*
-------------------------------------------------------------------------
encrypt()
-------------------------------------------------------------------------
Inputs: plainText, PublicKey
Outputs: the encrypted plainText
-------------------------------------------------------------------------
This Method encrypts a plaintext message using open pgp and PKI
-------------------------------------------------------------------------
 */

async function encrypt(pt, publicKey) {
    const { data: encrypted } = await openpgp.encrypt({
        message:  openpgp.message.fromText(pt),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys
    });

    return encrypted;
}

/*
-------------------------------------------------------------------------
decrypt()
-------------------------------------------------------------------------
Inputs: privateKey, publicKey, CypherText
Outputs: the decrypted plainText
-------------------------------------------------------------------------
This Method decrypts a cypher text message using open pgp and PKI
-------------------------------------------------------------------------
 */
async function decrypt(ct, publicKey, privateKey)  {
    const { data: decrypted } =  await openpgp.decrypt({
        message: await openpgp.message.readArmored(ct),
        publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
        privateKeys: [privateKey]
    });

    return decrypted;
}

/*
-------------------------------------------------------------------------
getPublicKey()
-------------------------------------------------------------------------
Outputs: publicKey
-------------------------------------------------------------------------
This Method gets your public key
-------------------------------------------------------------------------
 */
async function getPublicKey() {
    let pub = '';
    await fsp.readFile(pubKeyFile).then(data => {
        pub = data;
    });
    return pub;
}

/*
-------------------------------------------------------------------------
getPrivateKey()
-------------------------------------------------------------------------
Inputs: Password
Outputs: privateKey
-------------------------------------------------------------------------
This Method gets your Private key from open PGP given you have the
corresponding password
-------------------------------------------------------------------------
 */
async function getPrivateKey(pass) {
    let priv = '';
    await fsp.readFile(privKeyFile).then(data => {
        priv = data;
    });
    const { keys: [privateKey] } = await openpgp.key.readArmored(priv);
    await privateKey.decrypt(pass);
    return privateKey;
}

async function getKeys(pass) {
    let pub = await getPublicKey();
    let priv = await getPrivateKey(pass);
    return {pub: pub, priv: priv};
}

function hash(text) {
    var sha256 = crypto.createHash("sha256");
    sha256.update(text, 'utf8');
    return sha256.digest('base64');
}

function encode(pt) {
    return Buffer.from(pt).toString('base64');
}

function decode(ct) {
    return Buffer.from(ct, 'base64').toString('ascii');
}


async function test() {
    let text = 'why';
    let pub = await getPublicKey();
    let priv = await getPrivateKey('pgp');
    Promise.all([pub, priv]);

    let ct = await encrypt(text, pub);
    Promise.all([ct]);

    let dt = await decrypt(ct, pub, priv);

    console.log(`DEBUG:${dt}`)
}

module.exports = {
    encrypt,
    decrypt,
    getPublicKey,
    getPrivateKey,
    getKeys,
    hash,
    encode,
    decode
}
