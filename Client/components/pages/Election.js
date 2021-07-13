import React, { useState } from "react";
import { Box, Typography, Grid } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";

import { useQuery, useMutation } from "@apollo/client";
import { ElectionDisplay } from "../../graphql/query";

import "../../static/css/global.scss";
import Navigation from "../utils/Navigation";
import { sendPostRequest } from "../../hooks/API";
import Confirmation from "./Confirmation";
import ScrollToButton from "../utils/ScrollToButton";
import { electionTitle, electionDescription } from "../../static/constants";
import SubmitButton from "../utils/SubmitButton";
import CountdownTimer from "../utils/CountdownTimer";
import Race from "./Race";

function Election(props) {
  const [votingStep, setVotingStep] = useState(0);

  if (votingStep === 0) {
    return <Voting setVotingStep={setVotingStep} />;
  } else {
    return <Confirmation votingStep={votingStep} />;
  }
}

function Voting(props) {
  const { topicId } = useParams();
  const [selectedCandidates, setSelectedCandidates] = useState({});

  const { loading, error, data } = useQuery(ElectionDisplay, {
    variables: { title: topicId },
  });

  if (error) return `Error! ${error.message}`;
  if (loading) return <Skeleton variant="rect" width={"100%"} height={"100%"} />;

  console.log(data);

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function searchCandidateImage({ name }) {
    let candidateName = name.split(" ");
    console.log();
    return "./images/candidates/" + candidateName[0].toLowerCase() + ".jpg";
  }

  function handleVote() {
    props.setVotingStep(1);
    sendPostRequest("submit", {
      candidatesChosen: props.selectedCandidates,
    }).then((r) => {
      if (r == null) {
        props.produceSnackBar("Server error", "error");
      }
      if (r.data.success) {
        props.setVotingStep(2);
        props.setTopic(r.data.topicId);
        props.setHash(r.data.runningHash);
        props.setMessage(r.data.message);
        props.setSequence(r.data.sequence);
      } else {
        props.produceSnackBar("Vote Failed", "error");
      }
    });
  }

  function handleSelectedCandidate(candidate) {
    setSelectedCandidates({
      ...selectedCandidates,
      [candidate.position]: { name: candidate.name, description: candidate.description },
    });
  }

  function candidatesSelected(candidate) {
    if (selectedCandidates[candidate.position]) {
      if (selectedCandidates[candidate.position].name === candidate.name) {
        return true;
      }
    }
    return false;
  }

  return (
    <>
      <Navigation {...props} />
      <React.Fragment>
        <Box width={"100vw"} height={"100vh"} style={{ scrollBehavior: "smooth" }}>
          <Box width={"100%"} height={"100%"}>
            <Box minHeight={500} display={"flex"} flexDirection={"column"} bgcolor={"primary.main"}>
              <HeaderBar />
            </Box>

            {data.electionLookup.races.map((race, index) => {
              const isEven = index % 2 === 0;
              return (
                <Race
                  align={isEven ? "right" : "left"}
                  backgroundColor={!isEven ? "neutral.dark" : undefined}
                  flipped={!isEven}
                  race={race}
                  key={index}
                />
              );
            })}
          </Box>
        </Box>
        <ScrollToButton {...props}>
          <SubmitButton
            color="secondary"
            size="small"
            aria-label="scroll back to top"
            {...props}
            onClick={() => handleVote()}
          />
        </ScrollToButton>
      </React.Fragment>
    </>
  );
}

function HeaderBar() {
  return (
    <Grid container direction="column" justifyContent="center">
      <Box p={4}>
        <Typography variant="h2" align="center" style={{ color: "white" }}>
          {electionTitle}
        </Typography>
      </Box>
      <Box p={4}>
        <Typography variant="h5" align="center" style={{ color: "white" }}>
          {electionDescription}
        </Typography>
      </Box>
      <CountdownTimer />
    </Grid>
  );
}

export default Election;
