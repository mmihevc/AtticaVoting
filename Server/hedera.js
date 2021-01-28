const {
    Client,
    ConsensusSubmitMessageTransaction,
    ConsensusTopicId,
    ConsensusTopicCreateTransaction,
    MirrorClient,
    MirrorConsensusTopicQuery,
    Ed25519PrivateKey
} = require("@hashgraph/sdk");

const {hederaConfig} = require('./config/config.js');

module.exports = class HederaClass {
    
    constructor (account, key) {
        this.HederaClient = Client.forTestnet();
        this.configureAccount(account, key);
    }
    
    /*
    -------------------------------------------------------------------------
    sendHCSMessage()
    -------------------------------------------------------------------------
    Helper function given by Hedera's Cooper Kunz. Function builds a new
    ConsensusSubmitMessageTransaction and sends the messages to the
    configured TopicID
    -------------------------------------------------------------------------
    */
    async sendHCSMessage(msg) {
        try {
            new ConsensusSubmitMessageTransaction()
                .setTopicId(topicId)
                .setMessage(msg)
                .execute(HederaClient);
            log("ConsensusSubmitMessageTransaction()", msg, logStatus);
        } catch (error) {
            log("ERROR: ConsensusSubmitMessageTransaction()", error, logStatus);
            process.exit(1);
        }
    }

    /*
    -------------------------------------------------------------------------
    subscribeToMirror()
    -------------------------------------------------------------------------
    Helper function given by Hedera's Cooper Kunz. Function subscribes to
    the topic through the mirror consensus nodes.
    -------------------------------------------------------------------------
    */
    subscribeToMirror() {
        try {
            new MirrorConsensusTopicQuery()
                .setTopicId(topicId)
                .subscribe(mirrorNodeAddress, res => {
                    //log('DEBUG:', `${res['runningHash']}\nDEBUG: ${typeof res['runningHash']}`, logStatus);
                    let encMsg = new TextDecoder("utf-8").decode(res["message"]);
                    let confMsg = formatConfirmationMessage(encMsg, res.sequenceNumber, UInt8ToString(res['runningHash']));
                    let uidHash = encMsg.split(specialChar)[0];
                    

                });
            log("MirrorConsensusTopicQuery()", topicId.toString(), logStatus);
        } catch (error) {
            log("ERROR: MirrorConsensusTopicQuery()", error, logStatus);
            process.exit(1);
        }
    }

    /*
    -------------------------------------------------------------------------
    createTopicTransaction()
    -------------------------------------------------------------------------
    Function builds a ConsensusTopicCreateTransaction object with the
    configured topic memo and operator keys. Configures the topicID variable
    to the newly created topic.
    -------------------------------------------------------------------------
    */
    async createTopicTransaction(memo) {
        try {
            const txId = await new ConsensusTopicCreateTransaction()
                .setTopicMemo(memo)
                .setSubmitKey(this.operatorKey.publicKey)
                .execute(this.HederaClient);
            log("ConsensusTopicCreateTransaction()", `submitted tx ${txId}`, logStatus);
            await sleep(3000); // wait until Hedera reaches consensus
            const receipt = await txId.getReceipt(HederaClient);
            const newTopicId = receipt.getConsensusTopicId();
            log("ConsensusTopicCreateTransaction()", `success! new topic ${newTopicId}`, logStatus);
            this.topicId = newTopicId;
        } catch (error) {
            log("ERROR: createTopicTransaction()", error, logStatus);
            process.exit(1);
        }
    }

    /*
    -------------------------------------------------------------------------
    configureAccount(account, key)
    -------------------------------------------------------------------------
    Takes in the answers, if either account or key is empty, function will
    take the values from 'hederaConfig' and assign them to `operatorKey` and
    `operatorAccount`
    -------------------------------------------------------------------------
    */
    configureAccount(account, key, client) {
        try {
            if(account !== "") {
                this.operatorAccount = account;
            }else {
                this.operatorAccount = hederaConfig.account;
            }
            if(key !== "") {
                this.operatorKey = Ed25519PrivateKey.fromString(key);
            } else {
                this.operatorKey = Ed25519PrivateKey.fromString(hederaConfig.key);
            }

            this.HederaClient.setOperator(operatorAccount, operatorKey);

        } catch (error) {
            log("ERROR: configureAccount()", error, logStatus);
        }
    }
}