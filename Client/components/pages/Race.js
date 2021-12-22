import React from "react";
import { Box, Grid } from "@material-ui/core";

import ElectionItemLayout from "../cards/ElectionItemLayout";
import AmendmentCard from "../cards/AmendmentCard";
import ItemCard from "../cards/ItemCard";
import CandidateCard from "../cards/CandidateCard";
import RankedCandidateCard from "../cards/rankedChoice/RankedCandidateCard"

function Race(props) {
    
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }


  function handleSelectedElectionItem() {
    props.setRaceItemSelection({
      ...props.raceItemSelection,
      [props.raceID]: props.race.electionItems._id,
    });
  }

  const description = props.raceItemSelection[props.race._id]
    ? props.race.electionItems.find(
        (electionItem) => electionItem._id === props.raceItemSelection[props.race._id]
      ).description
    : props.race.description;


  const checked = props.raceItemSelection[props.race._id] === props.race.electionItems._id;

  return (
    <>
      <Box minHeight={626} bgcolor={props.backgroundColor}>
        <ElectionItemLayout align={props.align} title={props.race.title} description={description}>
          {props.race.electionItems.filter((electionItem) => 
            electionItem.__typename === 'Candidate'
          ).map((electionItem, index) => {
            return (
              <Grid item key={index}>
                <CandidateCard
                  checked={checked}
                  candidate={electionItem}
                  handleSelectedCandidate={handleSelectedElectionItem}
                />
              </Grid>
            )}
          )}
         
        </ElectionItemLayout>
      </Box>
      <WaveDivider flip={props.flipped}/>
    </>
  );
}

function DetermineElectionItemCard(props) {
  const checked = props.raceItemSelection[props.raceID] === props.electionItem._id;

  function handleSelectedElectionItem() {
    props.setRaceItemSelection({
      ...props.raceItemSelection,
      [props.raceID]: props.electionItem._id,
    });
  }

  switch (props.electionItem.__typename) {
    case "Amendment":
      return (
        <AmendmentCard
          checked={checked}
          amendment={props.electionItem}
          handleSelectedAmendment={handleSelectedElectionItem}
        />
      );
    case "Item":
      return (
        <ItemCard
          checked={checked}
          item={props.electionItem}
          handleSelectedItem={handleSelectedElectionItem}
        />
      );
    case "Candidate":
      return (
        <CandidateCard
          checked={checked}
          candidate={props.electionItem}
          handleSelectedCandidate={handleSelectedElectionItem}
        />
      );
  }

  return null;
}

const WaveDivider = (props) => {
  return (
    <Box
      color={"neutral.dark"}
      style={{ transform: props.flip ? "matrix(1,0,0,-1,0,0)" : undefined }}
    >
      <svg style={{ display: "block" }} viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path
          className={"wave"}
          fill="currentColor"
          d="M826.337463,25.5396311 C670.970254,58.655965 603.696181,68.7870267 447.802481,35.1443383 C293.342778,1.81111414 137.33377,1.81111414 0,1.81111414 L0,150 L1920,150 L1920,1.81111414 C1739.53523,-16.6853983 1679.86404,73.1607868 1389.7826,37.4859505 C1099.70117,1.81111414 981.704672,-7.57670281 826.337463,25.5396311 Z"
        />
      </svg>
    </Box>
  );
};

export default Race;
