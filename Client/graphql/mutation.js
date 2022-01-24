import { gql } from "@apollo/client";

export const SubmitVote = gql`
    mutation SubmitVote($electionID: ID!, $winners: [SubmitInput!]!) {
        submitVote(electionID: $electionID, winners: $winners) 
    }
`;