import React, {useState} from "react";
import {
    Typography, Box, Grid, Link, TableContainer, Paper, Table, TableBody, Button
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
                <ReceiptTable/>
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


function ReceiptTable() {
    const classes = useStyles();

    return (
        <>
            <Box pt={5}>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableBody>
                            <StyledTableRow >
                                <StyledTableCell component="th" scope="row">
                                    <Button>TopicID</Button>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    0
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Sequence
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    0
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Running Hash
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    0
                                </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell component="th" scope="row">
                                    Message
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    0
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