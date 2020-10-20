import React from 'react';
import Files from 'react-files'
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { 
	Button,
	CircularProgress,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	Input,
	InputLabel,
	Modal,
	Paper,
	TextField
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
const GreenCheckbox = withStyles({
	root: {
		color: green[400],
		'&$checked': {
			color: green[600],
		},
	},
	checked: {},
})((props) => <Checkbox color="default" {...props} />);

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

export default function BookUploadModal(props) {
	const classes = useStyles();
	// getModalStyle is not a pure function, we roll the style only on the first render
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = React.useState(false);

	let bookLoadingDisplay = '';

	let bookTitleDisplay = '';
	let fileUploadComponent = '';
	let handleSubmitButtonTitle = '';

	if(props.addBookOnly===true){
		bookTitleDisplay = 
			<Grid item xs={12}>
				<InputLabel htmlFor="title">Title:</InputLabel>
				<TextField id="bookTitle" aria-describedby="my-helper-text" value={props.bookTitle} onChange={props.handleFieldChange} />
			</Grid>;
		fileUploadComponent='';
		handleSubmitButtonTitle='Add Book';
	} else {
		bookTitleDisplay = 
			<Grid item xs={12}>
				<InputLabel htmlFor="title">Title:</InputLabel>
				{props.bookTitle}
			</Grid>;

		fileUploadComponent = <div className="files">
			<Files
				className='files-dropzone'
				onChange={file => {
				props.fileReader.readAsText(file[0]);
			}}
				onError={props.onFilesError}
				accepts={['.json', '.pdf']}
				multiple
				maxFiles={3}
				maxFileSize={10000000}
				minFileSize={0}
				clickable
			>
			Drop json file here or click to upload
			</Files>
		</div>;

		handleSubmitButtonTitle='Upload Citations';
	}

	if(props.modalLoading == true){
  		bookLoadingDisplay = <CircularProgress style={{margin:'auto', position: 'absolute', top:0,bottom:0,left:0,right:0, }} />;
	} else {
  		bookLoadingDisplay = <div style={modalStyle} className={classes.paper}>
				<h2 id="simple-modal-title">Add New Book and Citations</h2>
				<form noValidate autoComplete="off">
					
					<Grid item xs={12}>
						<FormControlLabel
							control={<GreenCheckbox checked={props.addBookOnly} onChange={props.handleAddBook} name="add_book_only" />}
							label="Add Book Only:"
						/>
					
						{bookTitleDisplay}
						<br/>
						
						<Grid item xs={12}>
							<InputLabel htmlFor="author_first_name">Author First Name:</InputLabel>
							<TextField id="author_first_name" aria-describedby="my-helper-text" value={props.author_first_name} onChange={props.handleFieldChange} />
						</Grid>
						
						<Grid item xs={12}>
							<InputLabel htmlFor="author_middle">Author Middle:</InputLabel>
							<TextField id="author_middle" aria-describedby="my-helper-text" value={props.author_middle} onChange={props.handleFieldChange} />
						</Grid>
						
						<Grid item xs={12}>
							<InputLabel htmlFor="author_last_name">Author Last Name:</InputLabel>
							<TextField id="author_last_name" aria-describedby="my-helper-text" value={props.author_last_name} onChange={props.handleFieldChange} />
						</Grid>
						
						<Grid item xs={12}>
							<InputLabel htmlFor="pages">Pages:</InputLabel>
							<TextField id="pages" aria-describedby="my-helper-text" onChange={props.handleFieldChange} />
						</Grid>
						<br/>
				        {fileUploadComponent}
					</Grid>
					<br/>
					
					<Grid item xs={12}>
						<Button variant="contained" color="primary" onClick={() => { props.handleSubmit() }}>
							{handleSubmitButtonTitle}
						</Button>
					</Grid>
					<br/>
				</form>
			</div>;
  }

  const body = (
        <Grid container spacing={3}>
            {bookLoadingDisplay}
	    </Grid>
  );

  return (
    <div>
      <Modal
        open={props.modalOpen}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}