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
        raceType
        candidates {
          _id
          type
          name
          description 
          image
        }
        items {
          _id
          type
          name
          image
        }
      }
      startDate
      endDate
    }
  }
`;


