import axios from 'axios'
import React, {Component} from 'react'
import Header from './../Header';
import Footer from './../Footer';
import BookUploadModal from './../Books/BookUploadModal';
import AddChapterModal from './../Books/AddChapterModal';
import ChapterSelectionModal from './../Books/ChapterSelectionModal';
import CitationModal from './../Books/CitationModal';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { 
	Button,
	CircularProgress,
	Collapse,
	Container,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	TextareaAutosize,
	Tooltip,
} from '@material-ui/core';
import { 
	AddComment as AddCommentIcon,  
	AddToQueue as AddToQueueIcon,
	Bookmarks as BookmarksIcon,
	CloudUpload as CloudUploadIcon,
	Delete as DeleteIcon,
	ExpandLess,
	ExpandMore,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

class UserBookList extends Component {
    state = {
        loading: true,
        addBookOnly: false,
        modalLoading:false,
        deleteInProgress:false,
		books: [],
		content: '',
		chapters: [],
		user: {},
		selectedBookId:null,
		selectedChapter:null,
		selectedBookCitations: [],
		modalOpen: false,
        jsonFile: {},
        citationPage:null,
        pages:null,
        bookTitle:'',
        author_first_name:'',
        author_middle:'',
        author_last_name:'',
        bookTitleForChInput:'',
        bookIdForChInput:null,
		chapterModalOpen: false,
		citationModalOpen: false,
		chapterSelectionModalOpen: false,
		chapterNum:null,
		chapterTitle:'',
		chapterPageBegin:null,
		chapterPageEnd:null,
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
        	modalLoading,
        	selectedBookCitations
        } = this.state;

        if ((prevState.selectedBookCitations != selectedBookCitations) || (prevState.loading != loading) || (prevState.modalLoading != modalLoading)) {
            await this.loadData();
        }
    }

	handleOpen = async () => {
		this.setState({ modalOpen:true });
	};

	handleOpenChapterInput = async (bookId) => {
		const { 
			books
		} = this.state;
		let selectedBook = books.find(book => book.id === bookId);

		this.setState({ 
			bookTitleForChInput: selectedBook['title'],
			bookIdForChInput: selectedBook['id'],
			chapterModalOpen:true, 
		});
	};

	handleOpenAddCitationInput = async (bookId) => {
		const { 
			books
		} = this.state;
		let selectedBook = books.find(book => book.id === bookId);

		this.setState({ 
			bookTitleForChInput: selectedBook['title'],
			bookIdForChInput: selectedBook['id'],
			citationModalOpen: true, 
			chapters: selectedBook.chapters ? selectedBook.chapters : [],
			bookIdForChInput: bookId
		});
	};

	handleOpenChapterSelectionModal = async (bookId, chapters) => {

		this.setState({ 
			chapters: chapters,
			chapterSelectionModalOpen:true, 
			selectedBookId:bookId
		});
	};

	assignChapters = async (bookId) => {

		const { 
			token
		} = this.state;

		axios.post('/api/citations/assignChapters', { 
        	bookId 
        },
        {   
        	headers: {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
        })
		.then(response => {
			swal("Done!", "Citation Chapters Assigned!", "success");
			this.loadData();
		})
		.catch(error => {
			this.setState({
		    	errors: error.response.data.errors
			});
		});
	};

	deleteBook = async (bookId) => {


		swal({
			title: "Are you sure?",
			text: "This will delete the book as well as all citations and chapters.",
			icon: "warning",
			dangerMode: true,
		})
		.then(willDelete => {

			const { 
				token
			} = this.state;

			this.setState({
				deleteInProgress:true
			});

			if (willDelete) {
				axios.delete(`/api/books/${bookId}`,
		        {   
		        	headers: {
		                'Authorization': 'Bearer '+token,
		                'Accept': 'application/json'
		            },
		        })
				.then(response => {
					swal("Deleted!", "Book has been deleted!", "success");
					this.loadData();
				})
				.catch(error => {
					this.setState({
				    	errors: error.response.data.errors
					});
				});
			}
		});
	};

	handleClose = async () => {
		this.setState({
			modalOpen:false,
			chapterModalOpen:false,
			chapterSelectionModalOpen:false,
			citationModalOpen: false
		});
	};

    onFilesChange = (files) => {
        console.log(files);
    }

    onFilesError = (error, file) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

	handleSubmit = async () => {

        await this.setState({
            modalLoading: true,
        });

        const { 
	        author_first_name,
	        author_middle,
	        author_last_name,
        	bookTitle,
        	jsonFile, 
        	pages, 
	        token,
        	user
        } = this.state;

        let data = {
        	bookTitle,
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
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
        })
		.then(response => {
			swal("Done!", "Book Citations Uploaded!", "success");
            this.setState({
                loading: true,
                addBookOnly: false,
                modalLoading:false,
                jsonFile: {},
			    author_first_name: '',
			    author_middle: '',
			    author_last_name: '',
            	bookTitle: '',
            	pages:null
            });
			this.handleClose();
		})
		.catch(error => {
			this.setState({
		    	errors: error.response.data.errors
			});
		});
	};

	handleChapterSubmit = async () => {
        const { 
        	bookIdForChInput,
        	chapterPageBegin,
        	chapterPageEnd,
        	chapterTitle,
        	chapterNum,
        	token
        } = this.state;

        let data = {
        	bookIdForChInput,
        	chapterPageBegin,
        	chapterPageEnd,
        	chapterTitle,
        	chapterNum
        }

		axios.post('/api/chapters', { 
        	data 
        },
        {   
        	headers: {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
        })
        .then(response => {
			swal("Done!", "Chapter Added!", "success");
            this.setState({
			    bookIdForChInput: null,
			    chapterPageBegin: null,
			    chapterPageEnd: null,
			    chapterTitle: '',
            	chapterNum: null

            });
			this.handleClose();
		})
		.catch(error => {
			this.setState({
		    	errors: error.response.data.errors
			});
		});
	}

	handleCitationSubmit = async () => {
        const { 
		    bookTitleForChInput,
		    bookIdForChInput,
		    selectedChapter,
		    citationPage,
		    content,
        	token
        } = this.state;

        let data = {
        	book_id: bookIdForChInput,
        	content: content,
		    chapter: selectedChapter ? selectedChapter : null,
		    page: citationPage,
        }

		axios.post('/api/citations', { 
        	data 
        },
        {   
        	headers: {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
        })
        .then(async response => {
			swal("Done!", "Citation Added!", "success");
            this.setState({
			    bookTitleForChInput: '',
			    bookIdForChInput: null,
			    selectedChapter: null,
			    citationPage: null,
			    content: '',
            	chapterNum: null

            });
        	await this.loadData();
			this.handleClose();
		})
		.catch(error => {
			this.setState({
		    	errors: error.response.data.errors
			});
		});
	}

	handleFieldChange = async (event) => {

		let { 
			pages
		} = this.state;
		pages = event.target.value
		this.setState({
            [event.target.id]: event.target.value,
			pages:pages
		});
	}

    handleBookListClick = async (event, bookId) => {
		event.preventDefault();

        await this.setState({
            loading: true,
            selectedBookCitations: []
        });

		let { 
			books
		} = this.state;

		let selectedBook = books.find(book => book.id === bookId);

        await this.setState({
            selectedBookCitations: selectedBook.citations
        });
    }

    handleChapterSelect = async (event) => {

		let { 
			books,
			selectedBookId
		} = this.state;

		let selectedChapterId = event.target.value;
		let bookCitations = '';
		let citations = [];
	    for (let key in books) {
	        if (books[key].id == selectedBookId && books[key].chapters) {
	            bookCitations = books[key].citations;
	            break;
	        }
	    }
	    for (let key in bookCitations) {

	        if (bookCitations[key].chapter == selectedChapterId) {
	            citations.push(bookCitations[key]);
	        }
	    }

        this.setState({
			selectedChapter:selectedChapterId,
			selectedBookCitations: citations,
			chapterSelectionModalOpen: false
        });
    };


    loadData = async () => {

		let { 
			token,
			user
		} = this.state;

        let userBooks = await axios.get('/api/books/showUserBooks', 
        {
        	headers: {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
            params: {
                userId: user.id
            }
        });

        const books = userBooks.data;
        this.setState({
            loading:false,
			deleteInProgress:false,
            books: books
        });
        return books;
	}

	handleAddBook = (e) => {
		this.setState({
			addBookOnly: e.target.checked
		});
	}

	render() {

		let { 
			addBookOnly,
			author_first_name,
			author_middle,
			author_last_name,
			books,
			bookIdForChInput,
			bookTitle,
			bookTitleForChInput,
			chapterModalOpen,
			chapterNum,
			chapterPageBegin,
			chapterPageEnd,
			chapters,
			chapterSelectionModalOpen,
			chapterTitle,
			citationModalOpen,
			citationPage,
			content,
			deleteInProgress,
			modalLoading,
			modalOpen,
			pages,
			selectedBookCitations,
			selectedChapter,
			token,
			loading
		} = this.state;

		let listOfBooks = '';

        if(books && books.length>0){
			listOfBooks = 
				<List component="nav" style={{maxHeight:'675px', overflow:'scroll'}} aria-label="main mailbox folders">
					{books.map(book => (

						<div key={`citationSource-${book.id}`}>
							<div>
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
							</div>
							<div>
	          					<Tooltip title="Add Citation" placement="top-start">
									<IconButton onClick={()=>this.handleOpenAddCitationInput(book.id)}>
										<AddCommentIcon />
									</IconButton>
								</Tooltip>
	          					<Tooltip title="Add Chapter" placement="top-start">
									<IconButton onClick={()=>this.handleOpenChapterInput(book.id)}>
										<AddToQueueIcon />
									</IconButton>
								</Tooltip>
	          					<Tooltip title="Process Citations with Chapters" placement="top-start">
									<IconButton onClick={()=>this.assignChapters(book.id)}>
										<BookmarksIcon />
									</IconButton>
								</Tooltip>
	          					<Tooltip title="Delete Book" placement="top-start">
									<IconButton onClick={()=>this.deleteBook(book.id)}>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
								{ (book.chapters.length > 0) ? <Button variant="outlined" onClick={()=>this.handleOpenChapterSelectionModal(book.id, book.chapters)} >Chapters</Button> : '' }
							</div>
							<Divider />
						</div>
					))}
				</List>
		}

        let citationsFromBook = '';
        if (loading === true) {
        	citationsFromBook = 
				<List >
					<div style={{verticalAlign: 'top', marginLeft:'3px',marginRight:'3px',marginTop:'50px',position:'relative' }} >
						<CircularProgress style={{margin:'auto', position: 'absolute', top:0,bottom:0,left:0,right:0, }} />
					</div>
				</List>;
        } else if(loading === false && selectedBookCitations && selectedBookCitations.length>0){
	        citationsFromBook =
				<List component="nav" style={{maxHeight:'675px', overflow:'scroll'}} aria-label="secondary mailbox folder">
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

        let generalBookCitationDisplay = '';
        if(deleteInProgress === true){
			generalBookCitationDisplay = 
        		<Grid container spacing={3}>
			        <Grid item xs={12}>
			        	<CircularProgress style={{margin:'auto', position: 'absolute', top:0,bottom:0,left:0,right:0, }} />
			        </Grid>
		        </Grid>;
        } else {
        	generalBookCitationDisplay = 
        		<Grid container spacing={3}>
			        <Grid item xs={12}>
						<div className='card-header'>
							Books
							<Button style={{float:'right', marginTop:'-6px'}} startIcon={<CloudUploadIcon />} onClick={this.handleOpen}>
								Upload Citations
							</Button>
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
		        			bookTitle={bookTitle} 
		        			addBookOnly={addBookOnly}
		        			handleAddBook={this.handleAddBook}
		        			author_first_name={author_first_name} 
		        			author_middle={author_middle} 
		        			author_last_name={author_last_name} 
		        			handleFieldChange={this.handleFieldChange} 
		        			pages={pages} 
		        			modalOpen={modalOpen} 
		        			fileReader={this.fileReader} 
		        			token={token} 
		        			handleSubmit={this.handleSubmit} 
		        			handleClose={this.handleClose} 
		        			onFilesChange={this.onFilesChange} 
		        			onFilesError={this.onFilesError} 
		        			handleOpen={this.handleOpen}
		        			modalLoading={modalLoading} 
		        		/>
			        </Grid>
			        <Grid item xs={12}>
		        		<AddChapterModal 
		        			bookTitleForChInput={bookTitleForChInput} 
		        			bookIdForChInput={bookIdForChInput} 
		        			handleFieldChange={this.handleFieldChange} 
		        			chapterModalOpen={chapterModalOpen} 
		        			chapterNum={chapterNum}
		        			chapterPageBegin={chapterPageBegin}
		        			chapterPageEnd={chapterPageEnd} 
		        			chapterTitle={chapterTitle} 
		        			handleChapterSubmit={this.handleChapterSubmit} 
		        			handleClose={this.handleClose} 
		        		/>
			        </Grid>
			        <Grid item xs={12}>
		        		<ChapterSelectionModal 
		        			chapters={chapters}
		        			chapterSelectionModalOpen={chapterSelectionModalOpen} 
		        			selectedChapter={selectedChapter}
		        			handleChapterSelect={this.handleChapterSelect}
		        			handleClose={this.handleClose} 
		        		/>
			        </Grid>
			        <Grid item xs={12}>
		        		<CitationModal 
		        			chapters={chapters}
		        			bookTitleForChInput={bookTitleForChInput}
		        			citationModalOpen={citationModalOpen} 
		        			content={content}
		        			citationPage={citationPage}
		        			bookIdForChInput={bookIdForChInput}
		        			handleClose={this.handleClose} 
		        			handleFieldChange={this.handleFieldChange} 
		        			handleCitationSubmit={this.handleCitationSubmit}
		        		/>
			        </Grid>
		        </Grid>;
        }

	    return (
	    	<Container maxWidth="lg">
		      	{generalBookCitationDisplay}
		    </Container>
		)
	}
}
export default withRouter(UserBookList)