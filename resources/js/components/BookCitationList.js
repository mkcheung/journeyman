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

	let {book_title, book_title_search_term, citations, handleFieldChange, handleGetCitations} = props; 

	const body = (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <div className='card-header'>Citations:</div>
            </Grid>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <InputLabel htmlFor="name">Title:</InputLabel>
                        <TextField 
                            id="book_title_search_term" 
                            title='book_title_search_term' 
                            onChange={handleFieldChange} 
                            value={book_title_search_term}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" onClick={(e) => handleGetCitations(e)}>
                            Search
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <ul>
                {
                    citations && citations.map(citation => (
                    <li key={citation.id}>
                        <div>
                            <div>
                                {book_title}
                            </div>
                            <div>
                                Page: {citation.page}
                            </div>
                            <p>
                                {citation.content}
                            </p>
                        </div>
                    </li>
                ))}
                </ul>
            </Grid>
	    </Grid>
	);

  return (
    <div>
        {body}
    </div>
  );
}