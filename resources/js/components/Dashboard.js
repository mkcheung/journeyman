import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
import { 
	Container,
	Grid,
	Paper
} from '@material-ui/core';


class Home extends Component {
	constructor() {
		super();
		this.state = {
			isLoggedIn: false,
			user: {}
		}	
	}

	// check if user is authenticated and storing authentication data as states if true
	componentWillMount() {
		let state = localStorage["appState"];

		if (state) {
			let AppState = JSON.parse(state);
			this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState.user });
		}
	}

	render() {
	  let { user } = this.state;
	    return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>

			        <Grid item xs={12}>
			        	<Header userData={this.state.user} userIsLoggedIn={this.state.isLoggedIn}/>
			        </Grid>

			        <Grid item xs={6}>
			          <Paper>Testing 123</Paper>
			        </Grid>
			        <Grid item xs={6}>
			          <Paper>Testing 123</Paper>
			        </Grid>
			          
			        <Grid item xs={12}>
			        	<Footer/>
			        </Grid>
		       </Grid>
		    </Container>
		)
	}
}
export default Home