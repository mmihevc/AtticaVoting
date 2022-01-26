import {makeStyles, TableCell, TableRow, withStyles} from "@material-ui/core";
import {green, red} from "@material-ui/core/colors";

export const title = 'Attica Voting';
export const electionTitle = 'Temporary Election Title';
export const electionDescription = 'this is the temporary description. In this description the rules for the election are ' +
    'defined along with any thing else that people should know before proceeding.';
export const electionStart = new Date(2021, 3, 25);
export const electionEnd = new Date(2021, 4, 27);

export const presidentialDescription = 'The president is the person in charge, that has the ultimate say in the end' +
    'there are is some more information about what a presidents role is';

export const teeShirtDescription = 'Please select your favorite shirt that you would like as next years official shirt' +
    'or some other information';

export const cuteDogDescription  = 'We know that all dogs are adorable but we are asking you to make a hard decision' +
    ' and vote for which dog you think is the cutest';

const buttonDims = {width: 185, height: 65};
export const scale = {x: 2, y: 3.5};

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
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        underline: {
            textDecoration: 'underline ' + theme.palette.secondary.main
        },
        candidateCard: {
            boxShadow: '0px 0px ' + theme.spacing(1) + 'px',
            '&:hover': {
                boxShadow: '0px 0px ' + theme.spacing(2) + 'px',
            },

        },
        fab: {
            position: "fixed",
            bottom: theme.spacing(6),
            right: theme.spacing(6),
        },
        fabWidth: { width: buttonDims.width, height: buttonDims.height },
        fabBackground: {
            backgroundColor: theme.palette.primary.main,
            boxShadow: "rgb(0 0 0 / 20%) 0px 3px 3px -2px, rgb(0 0 0 / 14%) 0px 3px 4px 0px, rgb(0 0 0 / 12%) 0px 1px 8px 0px"
        },
        fabText: { fontSize: 15, fontWeight: 600, color: 'white' },
        fabIcon: { fontSize: 25, marginRight: theme.spacing(1) },
        menuText: { fontSize: 21, fontWeight: 600 },
        menuWidth: {width: buttonDims.width * scale.x, height: buttonDims.height * scale.y},
        cancelButton: {
            backgroundColor: red[500],
            '&:hover': { backgroundColor: red[600] },
        },
        confirmButton: {
            backgroundColor: green[500],
            '&:hover': { backgroundColor: green[600] },
        },
        scroll: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 400,
          },
          selectEmpty: {
            marginTop: theme.spacing(2),
          },
          select: {
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: '#00000'
              },
              "& .MuiInputLabel-outlined.Mui-focused": {
                color:  '#00000'
              }
          }
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
