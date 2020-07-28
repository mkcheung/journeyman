
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import  SimpleModal  from './NewCategoryModal';
import { 
	Container,
	Grid,
	Modal,
	Paper
} from '@material-ui/core';

class CategoriesList extends Component {
	constructor () {
		super();
		this.state = {
			categories: [],
			open:false
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
	}

	componentDidMount() {
		axios.get('/api/categories').then(response => {
			this.setState({
				categories: response.data
			})
		})
	}


	handleOpen() {
		this.setState({ open:true });
	};

	handleClose() {
		this.setState({ open:false });
	};

	render () {
        const { categories, open } = this.state
        return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>
			        <Grid item xs={12}>
						<div className='card-header'>All Categories</div>
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
										{category.name}
									</Link>
								))}
							</ul>
						</div>
			        </Grid>
			        <Grid item xs={6}>
			        </Grid>
		        </Grid>
		        <SimpleModal />
		    </Container>
        );
	}
}

    export default CategoriesList;