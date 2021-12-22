import { gql } from "@apollo/client";

export const ElectionLookup = gql`
  query ElectionLookup($_id: ID) {
    electionLookup(_id: $_id) {
      title
      description
      races {
        _id
        name
        description
           electionItems {
              __typename
              _id
             name
              ... on Candidate {
                description
                image
              }
              ... on Amendment {
                description
                options
              }
              ... on Item {
                image
              }
           }
      }
      startDate
      endDate
    }
  }
`;


