import { gql } from "@apollo/client";

export const ElectionLookup = gql`
 query ElectionLookup($param: String!) {
    electionLookup(param: $param) {
      title
      param
      description
      _id
      races {
        _id
        name
        description
        title
        raceType
        ballotType
        candidates {
          _id
          type
          name
          description 
          image
          race
          rank
        }
        items {
          _id
          type
          name
          image
          race
        }
      }
      startDate
      endDate
    }
  }
`;


