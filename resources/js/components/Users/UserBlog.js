import axios from 'axios'
import React, {Component} from 'react'
import Header from './../Header';
import Footer from './../Footer';
import { Link, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import { 
	Box,
	Container,
	Grid,
	Paper
} from '@material-ui/core';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';


class UserBlog extends Component {

    state = {
        loading: true,
        post_id: [],
		user: {},
		posts: []
    };


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
			posts,
			user 
		} = this.state;
	    
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
							<HTMLEllipsis
								unsafeHTML={post.content}
								maxLine='3'
								ellipsis='...'
								basedOn='letters'
							/>
	        			</h2>
	        			Author: {user.full_name}
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