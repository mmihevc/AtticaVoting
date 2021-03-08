import React, {useEffect, useLayoutEffect, useRef} from "react";
import Navigation from "./Navigation";
import {CardMedia, Grid, Box, Typography, IconButton} from "@material-ui/core";
import vote from '../static/images/voting.gif';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import '../static/css/confirmation.scss';
import {useStyles} from "../static/constants";
import clsx from "clsx";



function Confirmation(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Navigation {...props}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: props.open,
                })}
            >
                <div className={classes.drawerHeader}/>
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Box pl={'50px'} pt={'100px'}>
                        <Grid item xs={12}>
                            <CardMedia
                                component="img"
                                image={vote}
                                title='voting-image'
                            />
                        </Grid>
                    </Box>
                    <DisplayMessage {...props}/>
                </Grid>
            </main>
        </div>

    )


}

function DisplayMessage(props) {

    const textBlock = useRef(null);

    useEffect(() => {
        if (!textBlock || !textBlock.current) return;

        const doTyping = async () =>
        {
            let isBackspacing = false, isSecondary = false;
            const text = [
                "Processing.|Please Wait",
                "Your Vote has been Submitted.|Thank you for voting"
            ];

            const element = textBlock.current;
            const header = element.getElementsByTagName("h2")[0];
            const secondary = element.getElementsByTagName("h4")[0];

            for (const page in text) {
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < page.length; j++) {
                        if (!isBackspacing ? page.charAt(j) : page.charAt(page.length - 1 - j) === "|") {
                            isSecondary = !isBackspacing;
                            if (isBackspacing) {
                                secondary.classList.remove("cursor");
                                header.classList.add("cursor");
                            }
                            else {
                                header.classList.remove("cursor");
                                secondary.classList.add("cursor");
                            }
                        } else {
                            if (!isBackspacing) {
                                if (!isSecondary) {
                                    header.textContent = header.textContent + page.charAt(i);
                                    console.log(header.textContent);
                                } else {
                                    secondary.textContent = secondary.textContent + page.charAt(i);
                                }
                            } else {
                                if (!isSecondary) {
                                    header.textContent = header.textContent.substring(0, header.textContent.length - 1);
                                } else {
                                    secondary.textContent = secondary.textContent.substring(0, secondary.textContent.length - 1);
                                }
                            }
                        }
                        console.log(header.innerHTML);
                        await new Promise(r => setTimeout(r, 4000));
                    }
                    isBackspacing = true;
                }
            }
        }
        doTyping();
    }, [textBlock]);

    return (
        <Grid item xs={6}>
            <div className='output' id='output' ref={textBlock}>
                <h2 className='cursor'/>
                <h4/>
                <Typography variant='h6'>
                    Learn More <IconButton><ArrowRightIcon/></IconButton>
                </Typography>
            </div>
        </Grid>
    );
}

export default Confirmation;