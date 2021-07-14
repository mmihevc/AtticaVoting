import { gql } from "@apollo/client";

export const ElectionDisplay = gql`
  query ElectionDisplay($title: String!) {
    electionLookup(title: $title) {
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


