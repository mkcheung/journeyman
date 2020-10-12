import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { 
	Collapse,
	Container,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper
} from '@material-ui/core';
import { 
	ExpandLess,
	ExpandMore,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

class UserBookList extends Component {
    state = {
        loading: true,
		books: [],
		user: {},
		selectedBookCitations: [],
    };

    async componentDidMount () {
		let state = localStorage["appState"];

		if (state) {
			let appState = JSON.parse(state);
			await this.setState(
				{ 
					user: appState.user,
		            token: appState.user.access_token,
		            rolesAndPermissions:appState.user.rolesAndPermissions,
		            userSpecificPermissions:appState.user.userSpecificPermissions,
				}
			);
        	await this.loadData();
		}
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
        	loading,
        	selectedBookCitations
        } = this.state;

        if (prevState.selectedBookCitations != selectedBookCitations) {
            await this.loadData();
        }
    }

    handleBookListClick = (event, bookId) => {
		event.preventDefault();
		let { 
			books
		} = this.state;

		let selectedBook = books.find(book => book.id === bookId);

        this.setState({
            selectedBookCitations: selectedBook.citations
        });
    }


    loadData = async () => {

        let userBooks = await axios.get('/api/books/showUserBooks', 
        {
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            },
            params: {
                userId: this.state.user.id
            }
        });

        const books = userBooks.data;
        this.setState({
            loading:false,
            books: books
        });
        return books;
	}

	render() {

		let { 
			books,
			selectedBookCitations,
		} = this.state;
	    

		let listOfBooks = '';
        if(books && books.length>0){
			listOfBooks = 
				<List component="nav" aria-label="main mailbox folders">
					{books.map(book => (
						<ListItem
							key={`book-${book.id}`}
							button
							onClick={(event) => this.handleBookListClick(event, book.id)}
						>
							{book.title}
						</ListItem>
					))}
				</List>
		}

        let citationsFromBook = '';
        if(selectedBookCitations && selectedBookCitations.length>0){
	        citationsFromBook =
				<List component="nav" style={{height:'85%', overflow:'scroll'}} aria-label="secondary mailbox folder">
					{selectedBookCitations.map(selectedBookCitation => (
						<ListItem 
							key={`selectedBookCitation-${selectedBookCitation.id}`}
						>
							{selectedBookCitation.content}
						</ListItem>
					))}
				</List>
        }

	    return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>
			        <Grid item xs={12}>
						<div className='card-header'>Books</div>
			        </Grid>
			        <Grid item xs={6}>
			        	{listOfBooks}
			        </Grid>
			        <Grid item xs={6}>
			        	{citationsFromBook}
			        </Grid>
		        </Grid>
		    </Container>
		)
	}
}
export default withRouter(UserBookList)