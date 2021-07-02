/*
-------------------------------------------------------------------------
createTopic()
-------------------------------------------------------------------------
Calls upon the configureTopicMemo() and createTopicTransaction() functions to
create a new topic and store the new topic ID to `topicId`.
-------------------------------------------------------------------------
*/

const createTopic = async (_, args, context, info) => {
    return context.hederaClient.createTopicTransaction(args.topicMemo);
}

export default createTopic;