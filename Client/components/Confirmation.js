import React, {useEffect, useRef, useState} from "react";
import Navigation from "./Navigation";
import {Grid, Box, Typography, Hidden, Button} from "@material-ui/core";
import vote from '../static/images/voting.gif';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

function Confirmation(props) {

    return (
        <>
            <Navigation {...props}/>
            <Grid container direction="row" alignItems="center">
                <Hidden mdDown>
                    <Grid item lg={6}>
                        <Box p={2}>
                            <img
                                src={vote}
                                title='voting-image'
                                style={{width:'80%'}}
                            />
                        </Box>
                    </Grid>
                </Hidden>
                <DisplayMessage {...props}/>
            </Grid>
        </>
    )


}

function DisplayMessage({votingStep}) {
    const [learnMore, setLearnMore] = useState(false);

    const textBlock = useRef(null);

    useEffect(() => {
        if (!textBlock || !textBlock.current) return;

        const element = textBlock.current;
        const header = element.getElementsByTagName("h2")[0];
        const secondary = element.getElementsByTagName("h4")[0];

        const text = [
            "Processing|Please Wait",
            "Submitted|Thank you for voting!"
        ];

        const doTyping = async () => {
            let page = text[0];
            let typingForwards = votingStep === 1;
            let typingHeader = votingStep === 1;
            const firstRun = typingForwards;

            do {
                if (firstRun && firstRun !== typingForwards) break;
                let prevData = { letter: null, iterations: 0};
                for (let k = 0; k < page.length; k++) {
                    if (prevData.iterations > 2) break;
                    if ((typingForwards ? page.charAt(k) : page.charAt(page.length - 1 - k)) === "|") {
                        typingHeader = !typingHeader;
                        (typingForwards ? header : secondary).classList.remove("cursor");
                        (typingForwards ? secondary : header).classList.add("cursor");
                    } else {
                        const currentTypingElement = typingHeader ? header : secondary;
                        currentTypingElement.innerText = typingForwards ?
                            currentTypingElement.innerText + page.charAt(k) :
                            currentTypingElement.innerText.substring(0, currentTypingElement.innerText.length - 1);
                        const lastLetter = currentTypingElement.innerText.length > 0 ?
                            currentTypingElement.innerText[currentTypingElement.innerText.length - 1] :
                            null;
                        if (prevData.letter === lastLetter) prevData.iterations += 1;
                        else prevData.iterations = 0;
                        prevData.letter = lastLetter;
                    }
                    await new Promise(r => setTimeout(r, 175));
                }
                page = text[1];
                typingForwards = !typingForwards;
            } while(firstRun !== typingForwards)
            if (!firstRun) setLearnMore(prevLearnMore => !prevLearnMore);
        }
        doTyping();
    }, [textBlock, votingStep]);

    return (
        <Grid item lg={6} xs={12}>
            <div className='output' id='output' ref={textBlock}>
                <Typography variant='h2' className='cursor'/>
                <Box pt={2} pb={2}>
                    <Typography variant='h4'/>
                </Box>
                {learnMore ?
                    <LearnMore icon={ArrowForwardIosIcon}/>:
                    null
                }
            </div>
        </Grid>
    );
}

const LearnMore = props =>
{
    const Icon = props.icon;


    return(
        <Button
            style={{height: 50, borderRadius: 8, textTransform: 'none'}}
        >
            <Box p={2}>
                <Grid container spacing={4}
                      alignItems={"center"} alignContent={"center"}
                >
                    <Grid item>
                        <Typography variant='h6'>Learn More</Typography>
                    </Grid>
                    <Icon color="primary"/>
                </Grid>
            </Box>
        </Button>
    )

}


export default Confirmation;