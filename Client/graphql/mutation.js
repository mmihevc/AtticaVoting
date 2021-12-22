import { gql } from "@apollo/client";

export const SubmitVote = gql`
    mutation SubmitVotes($electionID: ID!, $vote: [RaceVoteInput!]!) {
        submitVote(electionID: $electionID, vote: $vote) {
            _id
        }
    }
`;