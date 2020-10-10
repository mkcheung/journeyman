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


class RecentBlog extends Component {

    state = {
        recentPosts:[]
    };


    async componentDidMount () {
        await this.loadData();
    }

    loadData = async () => {

        let recentPostRes = await axios.get('/api/posts/getRecentPosts', 
        {
            headers: {
                'Accept': 'application/json'
            }
        });

	    let posts = recentPostRes.data;
        this.setState({
            recentPosts:posts
        });
	}

	render() {

		let { 
            recentPosts 
		} = this.state;
	    
	    return (
			<div className="container">
                {
                    recentPosts && recentPosts.map(post => (
                	<div key={`userpost-${post.id}`}>
	                    <h2>
							<Link
								to={`/post/show/${post.id}`}
								key={post.id}
							>
								{post.title}
							</Link>
	        			</h2>
	        			Author: {post.user.name}
	        			<br/>
	        			Posted: {post.created_at}
	            		<hr/>
                	</div>
                ))}
			</div>
		)
	}
}
export default withRouter(RecentBlog)