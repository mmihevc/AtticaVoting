const electionLookup = async (_, args, context, info) => {

    return context.db.collection("Election").findOne({"title": args.title})
}

export default electionLookup;