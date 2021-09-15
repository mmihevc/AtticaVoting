import mongodb from "mongodb";
import dotenv from "dotenv";

const { MongoClient } = mongodb;

dotenv.config();

export const client = new MongoClient(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/*export const removeNullArgs = (args) => {
	return Object.fromEntries(Object.entries(args).filter(([_, v]) => v != null));
};*/