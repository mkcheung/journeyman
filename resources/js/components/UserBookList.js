import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import  BookUploadModal  from './BookUploadModal';
import Footer from './Footer';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { 
	Collapse,
	Container,
	Divider,
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
		modalOpen: false,
        jsonFile: {},
        pages:null,
        bookTitle:'',
        author_first_name:'',
        author_middle:'',
        author_last_name:''
    };

    constructor(){
        super();
        this.fileReader = new FileReader();

        this.fileReader.onload = (event) => {
			let jsonFile = JSON.parse(event.target.result);
			let bookTitle = jsonFile.title;
            this.setState({ 
            	jsonFile: jsonFile,
            	bookTitle: bookTitle
            });
        };
    }

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

        if ((prevState.selectedBookCitations != selectedBookCitations) || (prevState.loading != loading)) {
            await this.loadData();
        }
    }

	handleOpen = async () => {
		this.setState({ modalOpen:true });
	};

	handleClose = async () => {
		this.setState({ modalOpen:false });
	};

    onFilesChange = (files) => {
        console.log(files);
    }

    onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

	handleSubmit = async () => {

        const { history } = this.props
        const { 
        	jsonFile, 
        	pages, 
        	user,
	        author_first_name,
	        author_middle,
	        author_last_name
        } = this.state;

        let data = {
        	jsonFile, 
        	pages,
        	userId: user.id, 
	        author_first_name,
	        author_middle,
	        author_last_name,
        }

		axios.post('/api/books', { 
        	data 
        },
        {   
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            },
        })
		.then(response => {
			swal("Done!", "Book Citations Uploaded!", "success");
            this.setState({
                loading: true,
                jsonFile: {},
			    author_first_name:'',
			    author_middle:'',
			    author_last_name:''

            });
			this.handleClose();
		})
		.catch(error => {
			this.setState({
		    	errors: error.response.data.errors
			});
		});
	};

	handleFieldChange = async (event) => {

		let { state, pages } = this.state;
		pages = event.target.value
		this.setState({
            [event.target.id]: event.target.value,
			pages:pages
		});
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
						<div key={`citationSource-${book.id}`}>
							<ListItem
								key={`book-${book.id}`}
								button
								onClick={(event) => this.handleBookListClick(event, book.id)}
								style={{height:'75px'}}
							>
								<div>
									<u>
										<strong>
											{book.title}
										</strong>
									</u><br/>
									By: {book.author_full_name}
								</div>
							</ListItem>
							<Divider />
						</div>
					))}
				</List>
		}

        let citationsFromBook = '';
        if(selectedBookCitations && selectedBookCitations.length>0){
	        citationsFromBook =
				<List component="nav" style={{height:'85%', overflow:'scroll'}} aria-label="secondary mailbox folder">
					{selectedBookCitations.map(selectedBookCitation => (
						<div key={`selectedBookCitation-${selectedBookCitation.id}`}>
							<div>
								<u>
									<strong>
										Page:{selectedBookCitation.page}
									</strong>
								</u>
							</div>
							<ListItem>
								"{selectedBookCitation.content}"
							</ListItem>
							<Divider />
						</div>
					))}
				</List>
        }

	    return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>
			        <Grid item xs={12}>
						<div className='card-header'>
						Books
						<button style={{float:'right'}} type="button" onClick={this.handleOpen}>
							Upload Citations
						</button>
						</div>
			        </Grid>
			        <Grid item xs={6}>
			        	{listOfBooks}
			        </Grid>
			        <Grid item xs={6}>
			        	{citationsFromBook}
			        </Grid>
			        <Grid item xs={12}>
		        		<BookUploadModal 
		        			bookTitle={this.state.bookTitle} 
		        			author_first_name={this.state.author_first_name} 
		        			author_middle={this.state.author_middle} 
		        			author_last_name={this.state.author_last_name} 
		        			handleFieldChange={this.handleFieldChange} 
		        			pages={this.state.pages} 
		        			modalOpen={this.state.modalOpen} 
		        			fileReader={this.fileReader} 
		        			token={this.state.token} 
		        			handleSubmit={this.handleSubmit} 
		        			handleClose={this.handleClose} 
		        			onFilesChange={this.onFilesChange} 
		        			onFilesError={this.onFilesError} 
		        			handleOpen={this.handleOpen} 
		        		/>
			        </Grid>
		        </Grid>
		    </Container>
		)
	}
}
export default withRouter(UserBookList)