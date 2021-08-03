import { gql } from "@apollo/client";

export const SubmitVote = gql`
    mutation SubmitVotes($raceID: [[ID!]!]!) {
        submitVote(raceID: $raceID) {
            success
            _id
        }
    }
`;