import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
import { Link, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import { 
	Box,
	Button,
    IconButton,
	Container,
	Grid,
	Paper,
	Switch
} from '@material-ui/core';
import { 
	ToggleButton
} from '@material-ui/lab';
import { 
	Check as CheckIcon,
	Delete as DeleteIcon,
	Edit as EditIcon
} from '@material-ui/icons';
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

    redirectToEdit = async (postId) => {

		this.props.history.push(`/post/edit/${postId}`);
	}

	deleteBook = async (postId) => {
		let { user } = this.state;
    	const userId = user.id;

		swal({
			title: "Are you sure?",
			text: "This will delete the blog post.",
			icon: "warning",
			dangerMode: true,
		})
		.then(willDelete => {

			if (willDelete) {
				axios.delete(`/api/posts/${postId}`,
		        {   
		        	headers: {
		                'Authorization': 'Bearer '+this.state.token,
		                'Accept': 'application/json'
		            },
		        })
				.then(response => {
					swal("Deleted!", "Post deleted!", "success");
					this.loadData(userId);
				})
				.catch(error => {
					this.setState({
				    	errors: error.response.data.errors
					});
				});
			}
		});
	};

	togglePublished = async (postId, published) => {
		let { posts, user } = this.state;
    	const userId = user.id;
        
		let post = posts.find(post => post.id === postId);
		published = !published;
		published = published ? 1 : 0 ;

        post['published'] = published;

        let successMsg = post.published ? 'published.' : 'set to private.';

        if (postId){
            let results = await axios.post('/api/posts/'+postId,
                { 
                    data: post,
                    _method: 'patch'                  
                },
                {   
                    headers: {
                        'Authorization': 'Bearer '+this.state.token,
                        'Accept': 'application/json'
                    }
                }
            );
            await this.loadData(userId);
        } 
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
	        			<div style={{float:'right', top:'-27px', position:'relative'}}>
							<Switch
								checked={post.published === 1 ? true : false}
								onChange={() => {
									this.togglePublished(post.id, post.published === 1);
								}}
								name="published"
								inputProps={{ 'aria-label': 'secondary checkbox' }}
							/>
							<Button style={{marginRight:'10px', height:'47px', top:'-1px'}} variant="contained" color="primary" onClick={()=>this.redirectToEdit(post.id)}>
								<EditIcon style={{color:'white'}} />
							</Button>
							<Button style={{height:'47px', top:'-1px'}} variant="contained" color="secondary" onClick={()=>this.deleteBook(post.id)}>
								<DeleteIcon style={{color:'white'}} />
							</Button>
	            		</div>
	            		<hr/>
                	</div>
                ))}
			</div>
		)
	}
}
export default withRouter(Home)