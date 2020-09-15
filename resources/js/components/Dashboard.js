import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
import { Link, Redirect } from 'react-router-dom';
import { 
	Container,
	Grid,
	Paper
} from '@material-ui/core';


class Home extends Component {

    state = {
		isLoggedIn: false,
        loading: true,
        post_id: [],
		user: {},
		posts: []
    };

	// check if user is authenticated and storing authentication data as states if true
	componentWillMount() {
		let state = localStorage["appState"];

		if (state) {
			let appState = JSON.parse(state);
			this.setState(
				{ 
					isLoggedIn: appState.isLoggedIn,
					user: appState.user,
		            token: appState.user.access_token,
		            rolesAndPermissions:appState.user.rolesAndPermissions,
		            userSpecificPermissions:appState.user.userSpecificPermissions,
				}
			);
		}
	}

    async componentDidMount () {

    	const userId = this.state.user.id;
        await this.loadData(userId);
    }

    loadData = async (userId) => {

        let postObj = await axios.get('/api/posts/getUserPosts', 
        {
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            },
            params: {
                userId: userId
            }
        });


	    let postData = postObj.data;
        this.setState({
            loading:false,
            posts: postData
        });
	}

	render() {

		let { 
			isLoggedIn,
			posts,
			user 
		} = this.state;
	    

        if (isLoggedIn === false) {
            this.props.history.push('/login');
		}

	    return (
	    	<Container maxWidth="lg">
		      	<Grid container spacing={3}>
			        <Grid item xs={6}>
			          <Paper>My Posts</Paper>
	                    {
	                        posts && posts.map(post => (
								<Link
									className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
									to={`/post/edit/${post.id}`}
									key={post.id}
								>
									{post.title}
								</Link>
	                    ))}
			        </Grid>
			        <Grid item xs={6}>
			          <Paper>Testing 123</Paper>
			        </Grid>
		       </Grid>
		    </Container>
		)
	}
}
export default Home