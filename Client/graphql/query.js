import { gql } from "@apollo/client";

export const ElectionLookup = gql`
 query ElectionLookup($title: String!) {
    electionLookup(title: $title) {
      title
      description
      _id
      races {
        _id
        name
        description
        title
        candidates {
          _id
          name
          description 
          image
        }
        items {
          _id
          name
          image
        }
      }
      startDate
      endDate
    }
  }
`;


