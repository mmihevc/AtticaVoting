import { gql } from "@apollo/client";

export const SubmitVote = gql`
    mutation SubmitVotes($electionID: ID!, $winners: [SubmitInput]) {
        submitVote(electionID: $electionID, winners: $winners) 
    }
`;