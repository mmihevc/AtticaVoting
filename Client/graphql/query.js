import { gql } from "@apollo/client";

export const ElectionDisplay = gql`
  query ElectionDisplay($title: String!) {
    electionLookup(title: $title) {
      title
      description
      races {
        name
        description
           electionItems {
              __typename
             name
              ... on Candidate {
                bio
              }
              ... on Amendment {
                description
                options
              }
           }
      }
      startDate
      endDate
    }
  }
`;
