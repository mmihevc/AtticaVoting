import React, {useState} from "react";
import { useSlopeCardMediaStyles } from '@mui-treasury/styles/cardMedia/slope';
import { Box, Grid, Typography, CardMedia, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useStyles } from "../../../static/constants";

function CandidateCard(props) {
    const mediaStyles = useSlopeCardMediaStyles();
    const classes = useStyles();
    const [filter, setFilter] = useState('');
    const [selectRank, setSelectRank] = useState(false);
    const [rank, setRank] = useState();
    
    

    function handleSelectRank() {
        setFilter('blur(10px)')
        setSelectRank(!selectRank);
    }

    function handleSelectedCandidate() {
        props.setBallotType('RCV');
        props.setRaceItemSelection({
          ...props.raceItemSelection,
          [props.raceID]: props.candidate._id,
        });
    }

    return (
        <Box style={{position: "relative"}}>
            <Box width={275} height={350} border={props.checked ? 2 : undefined}
                 onClick={props.handleSelectedCandidate} className={props.checked ? undefined : classes.candidateCard}
                boxShadow={props.checked ? 3 : undefined}>
                <div onClick={() => handleSelectRank()}>
                    <CardMedia image={props.image} title={props.candidate.name} classes={mediaStyles}
                        style={{height: 300, width:'100%', filter: filter}} onClick={() => handleSelectedCandidate()}/>
                    {selectRank ? 
                        <Box width={100} height={100} style={{position: "absolute", top: 100, left: 90}}>
                            <Grid container style={{height: "100%"}}
                              justifyContent={"center"} alignItems={"center"}>
                                <CandidateSelect {...props} rank={rank} setRank={setRank}/>
                            </Grid>
                        </Box> 
                    : null}
                </div>
                <Grid container direction='column' justifyContent={'center'} alignItems='center'>
                    <Grid item>
                        <Typography gutterBottom variant="h6" component="h2" className='candidateName'>{props.candidate.name}</Typography>
                    </Grid>

                </Grid> 
            </Box>
            {
                props.checked ?
                    <Box width={50} height={50} bgcolor={"secondary.main"} border={2} borderRadius={"50%"} style={{position: "absolute", top: -20, right: -20}}>
                        <Grid container style={{height: "100%"}}
                              justifyContent={"center"} alignItems={"center"}
                        >
                            {rank}
                        </Grid>
                    </Box> : null
            }
        </Box>
    )
}

function CandidateSelect(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        props.setRank(event.target.value);
    };

    return (
        <>
            <FormControl variant="outlined" fullWidth>
                <InputLabel>Rank</InputLabel>
                <Select
                    value={props.rank}
                    onChange={handleChange}
                    label="Rank"
                    style={{"backgroundColor": "white"}}
        
                >
                    <MenuItem value={1}>First</MenuItem>
                    <MenuItem value={2}>Second</MenuItem>
                    <MenuItem value={3}>Third</MenuItem>
                    <MenuItem value={4}>Fourth</MenuItem>
                    <MenuItem value={5}>Fifth</MenuItem>
                </Select>
        </FormControl>
      </>
    )
}

export default CandidateCard;