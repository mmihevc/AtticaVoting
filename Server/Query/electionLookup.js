import { ObjectId } from "mongodb";

const electionLookup = async (_, args, context, info) => {
    return {
        election: context.db.collection("Election").find({}).toArray()
    }
}

export default electionLookup;