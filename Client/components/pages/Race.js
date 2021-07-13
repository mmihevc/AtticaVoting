import React from "react";
import { Box, Grid } from "@material-ui/core";

import ElectionItemLayout from "../cards/ElectionItemLayout";
import AdmendmentCard from "../cards/AmendmentCard";
import ItemCard from "../cards/ItemCard";
import CandidateCard from "../cards/CandidateCard";

function Race(props) {

    function determineElectionItemCard() {
        switch (props.race.electionItems.__typeName) {
          case "Admendment":
            return <AdmendmentCard race={props.race} />;
          case "Item":
            return <ItemCard race={props.race}/>;
          case "Candidate":
            return <CandidateCard race={props.race}/>;
        }
      }

  return (
    <>
      <Box minHeight={626} bgcolor={props.backgroundColor}>
        <ElectionItemLayout
          align={props.align}
          title={props.race.title}
          description={props.race.description}
        >
         
            {determineElectionItemCard()}     

        </ElectionItemLayout>
      </Box>
      <WaveDivider  flip={props.flipped}/>
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
