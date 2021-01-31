import React, {useState} from "react";
import {
    Typography, Box, Grid, Link, TableContainer, Paper, Table, TableBody, Button, Collapse
} from "@material-ui/core";
import Navigation from "./Navigation";
import clsx from "clsx";
import {useStyles, StyledTableRow, StyledTableCell} from "../static/constants";


function Confirmation(props) {
    const classes = useStyles();
    const [receiptTable, setReceiptTable] = useState(false);

    return (
        <div className={classes.root}>
            <Navigation {...props} open={props.open} setOpen={props.setOpen}/>
            <main
                className={clsx(classes.content, {
                    [classes.contentShift]: props.open,
                })}
            >
                <div className={classes.drawerHeader}/>
            <ConfirmationMessage setReceiptTable={setReceiptTable} receiptTable={receiptTable} {...props}/>
            {receiptTable ?
                <ReceiptTable {...props}/>
                : null
            }
            </main>

        </div>
    )
}

function ConfirmationMessage(props) {
    return (
        <>
            <Box pt={5}>
                <Grid container justify='center'
                      alignItems='center' alignContent='center'>
                    <Grid item>
                        <Typography variant='h3'>
                            Thank you for voting!
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box pt={4}>
                            <Typography variant='h5'>
                                If you would like to view the receipt for your vote click
                                <Link onClick={() => props.setReceiptTable(!props.receiptTable)}
                                      color="primary" style={{ textDecoration: 'none' }}
                                > here </Link>
                                or if you would like to learn more about
                                Distributed Ledger Technology click
                                <Link onClick={() => props.history.push('dlinfo')} color="primary" style={{ textDecoration: 'none' }}> here </Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}


function ReceiptTable(props) {
    const classes = useStyles();
    const [topicExpand, setTopicExpanded] = useState(false);
    const [sequenceExpand, setSequenceExpand] = useState(false);
    const [hashExpand, setHashExpand] = useState(false);
    const [messageExpand, setMessageExpand] = useState(false);

    return (
        <>
            <Box pt={5}>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableBody>
                            <StyledTableRow >
                                <StyledTableCell component="th" scope="row">
                                    <Button
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: topicExpand,
                                        })}
                                        onClick={() => setTopicExpanded(!topicExpand)}
                                        aria-expanded={topicExpand}
                                        aria-label="show more">
                                        Topic ID
                                    </Button>
                                    <Box pt={1}>
                                        <Collapse in={topicExpand} timeout="auto" unmountOnExit>
                                            <Typography>
                                                It worked!
                                            </Typography>
                                        </Collapse>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {props.topic}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    <Button
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: sequenceExpand,
                                        })}
                                        onClick={() => setSequenceExpand(!sequenceExpand)}
                                        aria-expanded={sequenceExpand}
                                        aria-label="show more">
                                        Sequence
                                    </Button>
                                    <Box pt={1}>
                                        <Collapse in={sequenceExpand} timeout="auto" unmountOnExit>
                                            <Typography>
                                                It worked!
                                            </Typography>
                                        </Collapse>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    0
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    <Button
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: hashExpand,
                                        })}
                                        onClick={() => setHashExpand(!hashExpand)}
                                        aria-expanded={hashExpand}
                                        aria-label="show more">
                                        Running Hash
                                    </Button>
                                    <Box pt={1}>
                                        <Collapse in={hashExpand} timeout="auto" unmountOnExit>
                                            <Typography>
                                                It worked!
                                            </Typography>
                                        </Collapse>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {props.hash}
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    <Button
                                        className={clsx(classes.expand, {
                                            [classes.expandOpen]: messageExpand,
                                        })}
                                        onClick={() => setMessageExpand(!messageExpand)}
                                        aria-expanded={messageExpand}
                                        aria-label="show more">
                                        Message
                                    </Button>
                                    <Box pt={1}>
                                        <Collapse in={messageExpand} timeout="auto" unmountOnExit>
                                            <Typography>
                                                It worked!
                                            </Typography>
                                        </Collapse>
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {props.message}
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <ReceiptTableMessage/>
        </>
    )
}

function ReceiptTableMessage () {
    return (
        <>
            <Box pt={3}>
                <Grid container justify='center'
                      alignItems='center' alignContent='center'>
                    <Typography variant='h6'>
                        Click on each term to learn more about what each term means
                    </Typography>
                </Grid>
            </Box>
        </>
    )
}

export default Confirmation;