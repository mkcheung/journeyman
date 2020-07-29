
import axios from 'axios';
import React, { Component } from 'react';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import  SimpleModal  from './NewCategoryModal';
import { 
	Container,
	Grid,
	Modal,
	Paper
} from '@material-ui/core';

class CategoriesList extends Component {

    state = {
    	loading: true,
		errors: [],
		categories: [],
		open: false,
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
        	loading
        } = this.state;

        if (prevState.loading === true) {
            await this.loadData();
        }
    }

    loadData = async () => {

        try {
			await axios.get('/api/categories').then(response => {
	            this.setState({
	                loading: false,
	                categories: response.data
	            });
			})

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

		let { state, newCategory } = this.state;
		newCategory[event.target.id] = event.target.value
		this.setState({
			...state,
			newCategory:newCategory
		});
	}

	handleOpen = async () => {
		this.setState({ open:true });
	};

	handleClose = async () => {
		this.setState({ open:false });
	};

	handleSubmit = async () => {

        const { history } = this.props
        const { newCategory } = this.state;
		axios.post('/api/categories', newCategory)
			.then(response => {
				swal("Done!", "Category Created!", "success");
	            this.setState({
	                loading: true,
	            });
				this.handleClose();
			})
			.catch(error => {
				this.setState({
			    	errors: error.response.data.errors
				});
			});
	};

	render () {

        const { 
        	categories, 
        	open 
        } = this.state;

        console.log(categories);
        return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>
			        <Grid item xs={12}>
						<div className='card-header'>All Categories</div>
		        	<SimpleModal open={open} handleFieldChange={this.handleFieldChange} handleSubmit={this.handleSubmit} handleClose={this.handleClose} />

			        </Grid>
			        <Grid item xs={6}>
						<div className='card-body'>
							<ul className='list-group list-group-flush'>
								{categories.map(category => (
									<Link
										className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
										to={`/${category.id}`}
										key={category.id}
									>
										{category.title}
									</Link>
								))}
							</ul>
						</div>
			        </Grid>
			        <Grid item xs={6}>
						<button type="button" onClick={this.handleOpen}>
							Create Category
						</button>
			        </Grid>
		        </Grid>
		    </Container>
        );
	}
}

    export default CategoriesList;