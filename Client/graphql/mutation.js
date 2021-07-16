import { gql } from "@apollo/client";

export const submitVote = gql`
    mutation SubmitVotes($raceID: [ID]) {
        submitVote(raceID: $raceID) {
            _id
        }
    }
`;