import React from 'react';
import Files from 'react-files'
import { makeStyles } from '@material-ui/core/styles';
import { 
	Button,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	Input,
	InputLabel,
	Modal,
	Paper,
	Select,
    TextareaAutosize,
	TextField
} from '@material-ui/core';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    height:'500px',
    width:'500px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function CitationModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [citationModalOpen, setOpen] = React.useState(false);

  const body = (
        <Grid container spacing={3}>
            <div style={modalStyle} className={classes.paper}>
				<h2 id="simple-modal-title">Add Citation for {props.bookTitleForChInput}:</h2>
				<form noValidate autoComplete="off">
					
					<Grid item xs={12}>
                        <InputLabel htmlFor="page">Chapter:</InputLabel>
                        <TextField id="selectedChapter" type="number" aria-describedby="my-helper-text" value={props.selectedChapter} onChange={props.handleFieldChange} />
					</Grid>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="citationPage">Page:</InputLabel>
                        <TextField id="citationPage" aria-describedby="my-helper-text" value={props.citationPage} onChange={props.handleFieldChange} />
                    </Grid>
                    <br/>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="page">Citation:</InputLabel>
                        <TextareaAutosize id="content" rows={4} style={{width:'100%'}} aria-label="minimum height" value={props.content} placeholder="Place citation here" onChange={props.handleFieldChange} />
                    </Grid>
                    <br/>
                    
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={() => { props.handleCitationSubmit() }}>
                            Add Citation
                        </Button>
                    </Grid>
                    <br/>
				</form>
			</div>
	    </Grid>
  );

  return (
    <div>
      <Modal
        open={props.citationModalOpen}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}