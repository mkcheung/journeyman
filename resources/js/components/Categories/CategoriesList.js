
import axios from 'axios';
import React, { Component } from 'react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import  SimpleModal  from './NewCategoryModal';
import { 
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	Modal,
	Tooltip
} from '@material-ui/core';
import { 
	Edit as EditIcon,  
} from '@material-ui/icons';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';

class CategoriesList extends Component {

    state = {
    	loading: true,
		errors: [],
		categories: [],
		selectedCategoryPosts: [],
		open: false,
		update: false,
		newCategory: {
			title: '',
			description: '',
			slug: ''
		}
	};

    async componentDidMount(prevProps, prevState) {
        await this.loadData();
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
        	categories,
        	loading
        } = this.state;

        if (prevState.loading === true ) {
            await this.loadData();
        }
    }

    loadData = async () => {

        let state = localStorage["appState"];
        let appState = JSON.parse(state);
        try {
			 let categoriesAndPostResults = await axios.get('/api/categories/showUserCategories', 
                {
                    headers: {
                        'Authorization': 'Bearer '+appState.user.access_token,
                        'Accept': 'application/json'
                    },
	            params: {
	                userId: appState.user.id
	            }
			})

            const categoriesAndPosts = categoriesAndPostResults.data
			this.setState({
				loading: false,
				categories: categoriesAndPosts
			});
        	return categoriesAndPosts;

        } catch (error) {
            swal.fire({
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

	handleFieldChange = async (event) => {

		let { 
			state,
			newCategory 
		} = this.state;

		newCategory[event.target.id] = event.target.value
		this.setState({
			...state,
			newCategory:newCategory
		});
	}

	handleOpen = async () => {
		this.setState({ 
			open:true,
			update:false
		});
	};

	handleClose = async () => {
		this.setState({ 
			open:false,
			newCategory: {
				title: '',
				description: '',
				slug: ''
			}
		});
	};

	handleSubmit = async () => {

        const { history } = this.props
        const { 
        	newCategory,
        	update
        } = this.state;

        let state = localStorage["appState"];
        let appState = JSON.parse(state);

        if(update){
			let results = await axios.post('/api/categories/'+newCategory['id'], 
                { 
                    ...newCategory,
                    _method: 'patch'                  
                },
				{
	                headers: {
	                    'Authorization': 'Bearer '+appState.user.access_token,
	                    'Accept': 'application/json'
	                },
				}
			);
			swal("Done!", "Category Updated!", "success");
        } else {
			let results = await axios.post('/api/categories', 
				{
					...newCategory,
					userId: appState.user.id	
				},
				{
	                headers: {
	                    'Authorization': 'Bearer '+appState.user.access_token,
	                    'Accept': 'application/json'
	                },
				}
			);
			swal("Done!", "Category Created!", "success");
        }
        this.setState({
        	update: false,
            loading: true,
			newCategory: {
				title: '',
				description: '',
				slug: ''
			}
        });
		this.handleClose();
        await this.loadData();

	};

    handleCategoryPostsClick = async (event, categoryId) => {
		event.preventDefault();

        await this.setState({
            loading: true,
            selectedCategoryPosts: []
        });

		let { 
			categories
		} = this.state;

		let selectedCategory = categories.find(category => category.id === categoryId);

        await this.setState({
            selectedCategoryPosts: selectedCategory.posts
        });
    }

    handleCategoryEdit = async (event, categoryId) => {
		event.preventDefault();

		let { 
			categories,
			newCategory
		} = this.state;

		let selectedCategory = categories.find(category => category.id === categoryId);

        await this.setState({
            open: true,
            update: true,
            newCategory: selectedCategory
        });
    }



	render () {

        const { 
        	categories, 
        	loading,
        	open, 
        	update,
        	selectedCategoryPosts,
        	newCategory
        } = this.state;

        let state = localStorage["appState"];

		let listOfCategories = '';
        if(categories && categories.length>0){
			listOfCategories = 
				<List style={{maxHeight:'675px', overflow:'scroll'}} aria-label="main mailbox folders">
					{categories.map(category => (
						<div key={`categoryBlock-${category.id}`}>
							<div>
								<ListItem
									key={`category-${category.id}`}
									button
									onClick={(event) => this.handleCategoryPostsClick(event, category.id)}
									style={{height:'75px'}}
								>
									<div>
										<u>
											<strong>
												{category.title}
											</strong>
										</u><br/>
										Description: {category.description}
									</div>
								</ListItem>
							</div>
							<div>
	          					<Tooltip title="Edit Category" placement="top-start">
									<IconButton onClick={(event) => this.handleCategoryEdit(event, category.id)}>
										<EditIcon />
									</IconButton>
								</Tooltip>
							</div>
							<Divider />
						</div>
					))}
				</List>
		}

        let postsFromCategory = '';
        if (loading === true) {
        	postsFromCategory = 
				<List >
					<div style={{verticalAlign: 'top', marginLeft:'3px',marginRight:'3px',marginTop:'50px',position:'relative' }} >
						<CircularProgress style={{margin:'auto', position: 'absolute', top:0,bottom:0,left:0,right:0, }} />
					</div>
				</List>;
        } else if(loading === false && selectedCategoryPosts && selectedCategoryPosts.length>0){
	        postsFromCategory =
				<List component="nav" style={{maxHeight:'675px', overflow:'scroll'}} aria-label="secondary mailbox folder">
					{selectedCategoryPosts.map(selectedCategoryPost => (
						<div key={`selectedCategoryPost-${selectedCategoryPost.id}`}>
								<Link
									to={`/post/show/${selectedCategoryPost.id}`}
									key={selectedCategoryPost.id}
								>
									<ListItem>
										<div>
	                    					<h4>
												{selectedCategoryPost.title}
											</h4>
											<br/>
											<HTMLEllipsis
												unsafeHTML={selectedCategoryPost.content}
												maxLine='3'
												ellipsis='...'
												basedOn='letters'
											/>
										</div>
									</ListItem>
								</Link>
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
							All Categories
							<button style={{float:'right', marginTop:'-6px'}} type="button" onClick={this.handleOpen}>
								Create Category
							</button>
						</div>
			        </Grid>
			        <Grid item xs={6}>
						<div className='card-body'>
							{ listOfCategories }
						</div>
			        </Grid>
			        <Grid item xs={6}>
			        	{postsFromCategory}
			        </Grid>
		        </Grid>
		        <Grid item xs={12}>
		        	<SimpleModal open={open} update={update} newCategory={newCategory} handleFieldChange={this.handleFieldChange} handleSubmit={this.handleSubmit} handleClose={this.handleClose} />
		        </Grid>
		    </Container>
        );
	}
}

export default CategoriesList;