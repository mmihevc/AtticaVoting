import mongodb from "mongodb";
import dotenv from "dotenv";


const { MongoClient } = mongodb;

dotenv.config();

const uri = `mongodb+srv://mmihevc:${process.env.mongoUserPassword}@attica.0gzsj.mongodb.net/Attica?retryWrites=true&w=majority`;
export const client = new MongoClient(uri, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

