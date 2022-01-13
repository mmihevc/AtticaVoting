import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";

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


  function handleSelectedCandidate() {
    props.setRaceItemSelection({
      ...props.raceItemSelection,
      [props.race._id]: props.race.candidates._id,
    });
  }

  function handleSelectedItem() {
    props.setRaceItemSelection({
      ...props.raceItemSelection,
      [props.race._id]: props.race.items._id,
    });
  }

  function searchCandidateImage(name) {
    let candidateName = name.split(" ");
    return '/images/candidates/' + candidateName[0].toLowerCase() + '.jpg';
  }

  
  //const checked = false;

  const description = props.raceItemSelection[props.race._id]
    ? props.race.candidates.find(
        (candidate) => candidate._id === props.raceItemSelection[props.race._id]
      ).description
    : props.race.description;

  function DetermineDisplay() {
    if (props.race.candidates) {
      const checkedCandidate = props.raceItemSelection[props.race._id] === props.race.candidates._id;

      console.log(props.raceItemSelection)
      console.log(props.race.candidates._id)
      

      return (
        props.race.candidates.map((candidate, index) => {
          return (
            <Grid item key={index}>
              <CandidateCard
                checked={checkedCandidate}
                candidate={candidate}
                image={searchCandidateImage(candidate.name)}
                handleSelectedCandidate={handleSelectedCandidate}
              />
            </Grid>
          )}
        )
      )
    }
    else if (props.race.items){
      const checkedItem = props.raceItemSelection[props.race._id] === props.race.items._id;
      return (
        props.race.items.map((item, index) => {
          return (
            <Grid item key={index}>
              <ItemCard
                checked={checkedItem}
                item={item}
                image={searchCandidateImage(item.name)}
                handleSelectedItem={handleSelectedItem}
              />
            </Grid>
          )
        })
      )
    }
    else {
      return (
        <>
          <Typography>other card</Typography>
        </>
      )
    }
  }

  return (
    <>
      <Box minHeight={626} bgcolor={props.backgroundColor}>
        <ElectionItemLayout align={props.align} title={props.race.title} description={description}>
          <DetermineDisplay/>
        </ElectionItemLayout>
      </Box>
      <WaveDivider flip={props.flipped}/>
    </>
  );
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
