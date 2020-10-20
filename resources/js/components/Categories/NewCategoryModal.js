import React from 'react';
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

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const body = (
        <Grid container spacing={3}>
            <div style={modalStyle} className={classes.paper}>
				<h2 id="simple-modal-title">New Category</h2>
				<form noValidate autoComplete="off">
					
					<Grid item xs={12}>
						<InputLabel htmlFor="title">Category Name:</InputLabel>
						<TextField id="title" aria-describedby="my-helper-text" onChange={props.handleFieldChange} />
					</Grid>
					<br/>
					
					<Grid item xs={12}>
						<InputLabel htmlFor="slug">Slug:</InputLabel>
						<TextField id="slug" aria-describedby="my-helper-text" onChange={props.handleFieldChange} />
					</Grid>
					<br/>
					
					<Grid item xs={12}>
						<TextField
							id="description"
							label="Description"
							multiline
							rowsMax={4}
							defaultValue="Description"
							variant="outlined"
							onChange={props.handleFieldChange}
						/>
					</Grid>
					<br/>
					
					<Grid item xs={12}>
						<Button variant="contained" color="primary" onClick={() => { props.handleSubmit() }}>
							Create Category
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
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}