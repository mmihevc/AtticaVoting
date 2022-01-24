import { gql } from "@apollo/client";

export const SubmitVote = gql`
    mutation SubmitVotes($electionID: ID!, $vote: [SubmitInput]) {
        submitVote(electionID: $electionID, vote: $vote) {
            _id
        }
    }
`;