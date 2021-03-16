import {makeStyles, TableCell, TableRow, withStyles} from "@material-ui/core";

export const title = 'Attica Voting';
export const electionDescription = '';
export const electionStart = 0;
export const electionEnd = 0;

export const presidentialDescription = 'The president is the person in charge, that has the ultimate say in the end' +
    'there are is some more information about what a presidents role is';

export const teeShirtDescription = 'Please select your favorite shirt that you would like as next years official shirt' +
    'or some other information';

export const useStyles = makeStyles((theme) =>
    ({

        table: {
            minWidth: 700,
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        underline: {
            textDecoration: 'underline ' + theme.palette.secondary.main
        },
        fab: {
            position: 'fixed',
            bottom: theme.spacing(4),
            right: theme.spacing(4),
        },
    })
);

export const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    }
}))(TableCell);


export const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

export function handleSelectedCandidate(props) {
    props.setSelectedCandidates({
        ...props.selectedCandidates,
        [props.position]: props.name
    });
}
