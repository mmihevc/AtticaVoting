const electionLookup = async (_, args, context, info) => {

    return context.db.collection("Election").findOne({"param": args.param})
}

export default electionLookup;