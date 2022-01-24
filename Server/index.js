import express from "express";
import http from "http";

import { ApolloServer, PubSub,} from "apollo-server-express";
import { express as voyagerMiddleware } from "graphql-voyager/middleware/index.js";

import { promises as fs } from "fs";

import HederaClass from './hedera.js';
import mocks from "./mocking.js";
import { typeDefs, resolvers } from "./schema.js";

import {client} from './db';
require("dotenv").config();

const pubsub = new PubSub();

const app = express();
const serverMocks = process.env.MOCK ? mocks : undefined;
const serverTracing = process.env.MOCK ? true : undefined;


//dotenv.config(); //loads .env file that contains passwords and such

await client.connect();


const confirmList = [];

const  hederaClient = new HederaClass(process.env.ACCOUNT_ID, process.env.PRIVATE_KEY, process.env.NODE_ENV === 'development' ? "default" : "debug") //load global Hedera object

const server = new ApolloServer({ //this is the server woohoo, the graphql server more specifically
	typeDefs, //schema.graphql file
	resolvers, 
	mocks: serverMocks, //uses mocking.js, need npm run mockServer, generates pysedo-random data
	tracing: serverTracing,
	formatError: (err) => { //formats error and logs internal server error
		if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
			if (err.extensions) console.error(`${err.extensions.code}: ${err.message}`);
			else console.error(err);
		}
		return err;
	},
	context: async ({ req, connection }) => { //creates context, global
		return {
			pubsub: pubsub,
            hederaClient: hederaClient,
			db: client.db('Attica')

		};
	}
});

server.start();
server.applyMiddleware({ app }); //embeds express into graph server

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


//moved /submit

app.get('/api/candidates', async (req,res) => {
    const candidateList = JSON.parse(await fs.readFile('./server/candidates.json'));
    res.send(candidateList);
});

console.log(__dirname + "/website/index.html")
if (process.env.NODE_ENV === "development") {
	app.use("/voyager", voyagerMiddleware({ endpointUrl: "/graphql" }));
} else { //if in production give specific page
	app.get("index.html", (req, res) => res.sendFile(__dirname + "/website/index.html"));
    
	app.use(express.static(__dirname + "/website"));
	app.get("*", (req, res) => res.sendFile(__dirname + "/website/index.html"));
}

const PORT = 8000;
const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer); //install subscription for graph
httpServer.listen(PORT);

console.info(`🚀 Server Ready at localhost:${PORT}${server.graphqlPath}`);
console.info(`🚀 Subscriptions Ready at ws://localhost:${PORT}${server.subscriptionsPath}`);

