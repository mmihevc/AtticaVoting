import mongodb from "mongodb";
import dotenv from "dotenv";


const { MongoClient } = mongodb;

dotenv.config();

const uri = `mongodb+srv://mmihevc:${process.env.mongoUserPassword}@attica.0gzsj.mongodb.net/Attica?retryWrites=true&w=majority`;
export const client = new MongoClient(uri, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

export const connect = async () => {
  console.log("Connecting to database");
  try {
    await client.connect();
    console.log("Connected to server");
  } catch (err) {
    console.log(err);
  }
  finally {
    await client.close()
  }
}


/*client.connect(err => {
  const collection = client.db("Attica").collection("devices");
  // perform actions on the collection object
  //client.close();
});*/


/*export const removeNullArgs = (args) => {
	return Object.fromEntries(Object.entries(args).filter(([_, v]) => v != null));
};*/