import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Files from 'react-files'
import { 
	Button,
	Container,
	Grid,
	Paper,
	Switch,
	Tooltip,
} from '@material-ui/core';
import { 
	Delete as DeleteIcon,
	Edit as EditIcon,
	List as ListIcon,
	PlaylistAdd as PlaylistAddIcon
} from '@material-ui/icons';
import { 
	makeStyles
} from '@material-ui/core/styles';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { 
	ColorDeleteButton,
	ColorEditButton,
	IOSSwitch 
} from './../CustomComponents/CustomComponents';
import { Link, useHistory } from 'react-router-dom';

function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => 
        setState(prevState => Object.assign({}, prevState, newState)
    );
    return [state, setMergedState];
}

export default function Home(props) {

    let user = {};
    let token = '';
    let state = localStorage["appState"];

    if (state) {
        let appState = JSON.parse(state);
        user = appState.user;
        token = user.access_token;
     }

    const history = useHistory();

    const [combined, setCombined] = useMergeState({
        loading: true,
        posts: [],
    });

    const [loading, setLoading] = useState(true);

    useEffect( () => {
        async function loadData(userId=null, postId=null){

		    let postData = [];

	    	if(postId !== null){

		        let postObj = await axios.get('/api/posts/getPostAndDecendants', 
		        {
		        	headers: {
		                'Authorization': 'Bearer '+token,
		                'Accept': 'application/json'
		            },
		            params: {
		                postId: postId
		            }
		        });
			    postData = postObj.data;
	    	} else {

		        let postObj = await axios.get('/api/posts/getUserPosts', 
		        {
		        	headers: {
		                'Authorization': 'Bearer '+token,
		                'Accept': 'application/json'
		            },
		            params: {
		                userId: userId
		            }
		        });

			    postData = postObj.data;
	    	}

	        await setCombined({
	            loading: false,
	            posts: postData
	        });
        }

    	// const userId = user.id;
        if (props.match.params.id !== null && props.match.params.id !== undefined) {
            loadData(null, props.match.params.id);
        } else {
            loadData(user.id);
        }
    }, [user.id, props.match.params.id, combined.loading]);


	const deleteBook = async (postId) => {

    	const userId = user.id;

		swal({
			title: "Are you sure?",
			text: "This will delete the blog post.",
			icon: "warning",
			dangerMode: true,
		})
		.then(async willDelete => {

			if (willDelete) {
				await axios.delete(`/api/posts/${postId}`,
		        {   
		        	headers: {
		                'Authorization': 'Bearer '+token,
		                'Accept': 'application/json'
		            },
		        });

				swal("Deleted!", "Post deleted!", "success");
				await setCombined({
					loading: true
				});
			}
		});
	};

	const togglePublished = async (postId, published) => {

    	const userId = user.id;
        
		let post = combined.posts.find(post => post.id === postId);
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
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    }
                }
            );

	        await setCombined({
	            loading: true
	        });
        } 
	}

    const loadPostDescendants = async (postId) => {
    	
        history.push(`/dashboard/${postId}`);
	}

    const redirectToEdit = async (postId) => {

		history.push(`/post/edit/${postId}`);
	}

    const redirectToAddChapter = async (postId) => {
		history.push(`/post/create/chapter/${postId}`);
	}

    const showDescendantPosts = props.match.params.id ? true : false;

    let postsOnDashboard = <div></div>;
    let showDescPosts = <div></div>;

	if(combined.posts.length > 0){
        postsOnDashboard = 
                    <div>
                        {
                            combined.posts.length && combined.posts.map(post => (
	                		<div key={`post-${post.id}`}>
			                    <h2>
									<Link
										to={`/post/show/${post.id}`}
										key={post.id}
										style={{ textDecoration: 'none', color:'black' }}
									>
										{post.title}
									</Link>
			        			</h2>
								<HTMLEllipsis
									unsafeHTML={post.content}
									maxLine='3'
									ellipsis='...'
									basedOn='letters'
								/>
			        			Author: {post.user.full_name}
		        				<br/>
		        				Posted: {post.created_at}
			        			<div style={{float:'right', top:'-27px', position:'relative'}}>
				  					<Tooltip title="Publish" placement="bottom">
										<IOSSwitch
											checked={post.published === 1 ? true : false}
											onChange={() => {
												togglePublished(post.id, post.published === 1);
											}}
											name="published"
											inputProps={{ 'aria-label': 'secondary checkbox' }}
										/>
									</Tooltip>
									{
										(showDescendantPosts === false && post.descendant_post_id !== null )&& 

											<ColorEditButton style={{marginRight:'10px', height:'47px', top:'-1px'}} variant="contained" color="primary" onClick={()=>loadPostDescendants(post.id)}>
												<ListIcon style={{color:'white'}} />
											</ColorEditButton>
									}
									{
										(showDescendantPosts === false && post.descendant_post_id == null) &&
								            <Tooltip title="Add Chapter" placement="bottom">
								                <ColorEditButton style={{marginRight:'10px', height:'47px', top:'-1px'}} variant="contained" color="primary" onClick={()=>redirectToAddChapter(post.id)}>
								                    <PlaylistAddIcon style={{color:'white'}} />
								                </ColorEditButton>
								            </Tooltip>
									}
				  					<Tooltip title="Edit Post" placement="bottom">
										<ColorEditButton style={{marginRight:'10px', height:'47px', top:'-1px'}} variant="contained" color="primary" onClick={()=>redirectToEdit(post.id)}>
											<EditIcon style={{color:'white'}} />
										</ColorEditButton>
									</Tooltip>
				  					<Tooltip title="Delete Post(s)" placement="bottom">
										<ColorDeleteButton style={{height:'47px', top:'-1px'}} variant="contained" color="secondary" onClick={()=>deleteBook(post.id)}>
											<DeleteIcon style={{color:'white'}} />
										</ColorDeleteButton>
									</Tooltip>
			            		</div>
		            			<hr/>
                			</div>
                        ))}
                    </div>
                }


	if (showDescendantPosts === true) {
		showDescPosts = <div className="container">
				<Tooltip title="Add Chapter" placement="bottom">
				<Button style={{height:'47px', top:'-1px', float:'right'}} variant="contained" color="primary" onClick={()=>redirectToAddChapter(props.match.params.id)}>
					<PlaylistAddIcon style={{color:'white'}} />
				</Button>
			</Tooltip>
		</div>
	}
    return (

        <Container maxWidth="lg">
			<div className="container">
			{postsOnDashboard}
			</div>
			{showDescPosts}
        </Container>
    )
}