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


export default function BookCitationList(props) {

	let {book_title, book_title_search_term, citations, handleClick, handleFieldChange, handleGetCitations, handleOpenChapterSelectionModal} = props; 

	const body = (
        <Grid container spacing={3}>
            <Grid item xs={12} className='card-header'>
                Citations:
                <Button id="citationSubmit" variant="contained" color="primary" onClick={() => handleOpenChapterSelectionModal()}>
                    Search
                </Button>
            </Grid>

            <Grid item xs={12}>
                <div style={{'textAlign':'center'}}>
                    <InputLabel>{book_title}</InputLabel>
                </div>
            </Grid>
            <Grid container style={{height:'750px'}}>
                <Grid item xs={12}>
                    <ul style={{maxHeight:'675px', overflow:'scroll'}}>
                    {
                        citations && citations.map(citation => (
                        <li key={citation.id} onClick={(e) => handleClick(e)}>
                            <div className="title">
                                {book_title}
                            </div>
                            <div className="page">
                                Page: {citation.page}
                            </div>
                            <p className="citationText">
                                {citation.content}
                            </p>
                        </li>
                    ))}
                    </ul>
                </Grid>
            </Grid>
	    </Grid>
	);

  return (
    <div>
        {body}
    </div>
  );
}