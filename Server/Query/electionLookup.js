import { removeNullArgs } from "../db.js";

const electionLookup = async (_, args, context, info) => {

    return context.db.collection("Election").findOne({"title": args.title})
}

export default electionLookup;