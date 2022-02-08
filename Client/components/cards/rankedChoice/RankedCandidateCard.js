import React, {useEffect, useState} from "react";
import { useSlopeCardMediaStyles } from '@mui-treasury/styles/cardMedia/slope';
import { Box, Grid, Typography, CardMedia } from "@material-ui/core";
import { Select, MenuItem, FormControl } from '@mui/material'
import { useStyles } from "../../../static/constants";

function RankedCandidateCard(props) {
    const mediaStyles = useSlopeCardMediaStyles();
    const classes = useStyles();
    const [rank, setRank] = useState('');
    
    function handleSelectedCandidate() {


        if (props.raceItemSelectionRanked[props.raceID] === undefined || !props.raceItemSelectionRanked[props.raceID].includes(props.candidate._id)) {
            props.setRaceItemSelectionRanked({
                [props.raceID]: ([...props.raceItemSelectionRanked[props.raceID], props.candidate._id])
            });
        }
        console.log(props.checked)

        //props.setCheckedRCV([...props.checkedRCV, {cID: props.candidate._id, checked: true}])

        props.setWinners({
            ...props.winner,
            [props.title]: {rank: rank, name: props.candidate.name}
        })
    }

    return (
        <Box style={{position: "relative"}}>
            <Box width={275} height={350} border={props.checked ? 2 : undefined}
                 className={props.checked ? undefined : classes.candidateCard}
                 boxShadow={props.checked ? 3 : undefined}>
                <div >
                    <CardMedia image={props.image} title={props.candidate.name} classes={mediaStyles}
                        style={{height: 300, width:'100%', filter: props.checked ? 'blur(10px)' : null}} onClick={() => handleSelectedCandidate()}/>
                    {props.checked ? 
                        <Box width={100} height={100} style={{position: "absolute", top: 100, left: 90}}>
                            <Grid container style={{height: "100%"}}
                              justifyContent={"center"} alignItems={"center"}>
                                <CandidateSelect {...props} size={props.size} rank={rank} setRank={setRank}/>
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
            {props.checked ? 
                <Box width={50} height={50} bgcolor={"secondary.main"} border={2} borderRadius={"50%"} style={{position: "absolute", top: -20, right: -20}}>
                <Grid container style={{height: "100%"}}
                    justifyContent={"center"} alignItems={"center"}
                >
                    {rank}
                </Grid>
                </Box> 
                : null
            }
            
        </Box>
    )
}

function CandidateSelect(props) {
    const classes = useStyles();

    const handleChange = (event) => {
        props.setRank(event.target.value);
    };

    let menuItems = [];

    for (let i = 0; i < props.size; i++) {
        let value = i + 1;
        if (value === 1) {
           menuItems.push({value: value, label: value + 'st'})
        }
        else if (value === 2) {
            menuItems.push({value: value, label: value + 'nd'})
        }
        else if (value === 3) {
            menuItems.push({value: value, label: value + 'rd'})
        }
        else {
            menuItems.push({value: value, label: value + 'th'})
        }
    }

    return (
        <>
            <FormControl variant="outlined" fullWidth>
                <Select
                    value={props.rank ?? " "}
                    onChange={handleChange}
                    displayEmpty
                    style={{"backgroundColor": "white"}}
                    inputProps={{ 'aria-label': 'Select Rank' }}
                >
                    <MenuItem value={''}><em>Rank</em></MenuItem>
                    {menuItems.map(({value, label}, index) => <MenuItem key={index} value={value}>{label}</MenuItem>)}
                </Select>
        </FormControl>
      </>
    )
}

export default RankedCandidateCard;