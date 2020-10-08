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


class UserBlog extends Component {

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

	async componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.id !== this.state.user.id) {
			await this.loadData(nextProps.match.params.id);
		}
	}

    async componentDidMount () {

        const userId = (this.props.match.params.id) ? this.props.match.params.id : null;
        await this.loadData(userId);
    }

    loadData = async (userId) => {

        let userObj = await axios.get('/api/users/showUserBlogPosts', 
        {
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            },
            params: {
                userId: userId
            }
        });

	    let userData = userObj.data;
        this.setState({
            loading:false,
            user:userData[0],
            posts:userData[0]['posts']
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
                	<div key={`userpost-${post.id}`}>
	                    <h2>
							<Link
								to={`/post/show/${post.id}`}
								key={post.id}
							>
								{post.title}
							</Link>
	        			</h2>
	        			Author: {user.name}
	        			<br/>
	        			Posted: {post.created_at}
	            		<hr/>
                	</div>
                ))}
			</div>
		)
	}
}
export default withRouter(UserBlog)