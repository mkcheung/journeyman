import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
import { Link, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import { 
	Box,
	Container,
	Grid,
	Paper
} from '@material-ui/core';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';


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
			<div className="container">
                {
                    posts && posts.map(post => (
                	<div key={`post-${post.id}`}>
	                    <h2>
							<Link
								to={`/post/show/${post.id}`}
								key={post.id}
							>
								{post.title}
							</Link>
							<HTMLEllipsis
								unsafeHTML={post.content}
								maxLine='3'
								ellipsis='...'
								basedOn='letters'
							/>
	        			</h2>
	        			Author: {post.user.full_name}
	        			<br/>
	        			Posted: {post.created_at}
	            		<hr/>
                	</div>
                ))}
			</div>
		)
	}
}
export default withRouter(Home)