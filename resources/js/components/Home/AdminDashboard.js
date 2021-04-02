import axios from 'axios'
import React, { Component, useState, useEffect } from 'react'
import Header from './../Header';
import Footer from './../Footer';
import { Link, Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import { 
	Collapse,
	Container,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper
} from '@material-ui/core';
import { 
	ExpandLess,
	ExpandMore,
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
        inputInputForTags: {
        padding: theme.spacing(1, 1, 1, 0),
    },
}));

function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => 
        setState(prevState => Object.assign({}, prevState, newState)
    );
    return [state, setMergedState];
}

export default function AdminDashboard(props) {

    let user = {};
    let token = '';
    let state = localStorage["appState"];

    if (state) {
        let appState = JSON.parse(state);
        user = appState.user;
        token = user.access_token;
    }

    const history = useHistory();
    const classes = useStyles();

    const [combined, setCombined] = useMergeState({
        isLoggedIn: false,
        loading: true,
        post_id: [],
		allUsers: [],
		posts: [],
		userListOpen: false,
		openStatusSlots: {}
    });


    useEffect( () => {
        async function loadData(){

	        let allUsers = await axios.get('/api/users/', 
	        {
	        	headers: {
	                'Authorization': 'Bearer '+token,
	                'Accept': 'application/json'
	            }
	        });

	        console.log(allUsers);

	        let postsObj = await axios.get('/api/posts/', 
	        {
	        	headers: {
	                'Authorization': 'Bearer '+token,
	                'Accept': 'application/json'
	            }
	        });


		    let postData = postsObj.data;
		    let openStatusSlots = {};
		    postData.map(function(pd){
		    	openStatusSlots['open-user-'+pd.id] = false;
		    });

            await setCombined({
	            loading:false,
	            posts: postData,
	            openStatusSlots,
	            allUsers:allUsers.data
            });
        }
        loadData();
    }, []);

    const handleClick = async (postId) => {

		let newOpenStatusSlots = combined.openStatusSlots;

		newOpenStatusSlots['open-user-'+postId] = !(newOpenStatusSlots['open-user-'+postId]);

        await setCombined({
            openStatusSlots:newOpenStatusSlots
        });
    }

    const handleUserListClick = async () => {
		let newUserListOpen = combined.userListOpen;
		
    	newUserListOpen = !newUserListOpen;

        await setCombined({
            userListOpen:newUserListOpen
        });
    }

return (
	    	<Container maxWidth="lg">
		      	<Grid container>
    				<List
			      		style={{width: '100%'}}
			      	>
	                    {
	                        	<div>
									<ListItem button onClick={() => handleUserListClick()}>
										<ListItemIcon>
											Users
										</ListItemIcon>
										<ListItemText/>
										{combined.userListOpen ? <ExpandLess /> : <ExpandMore />}
									</ListItem>
	      							<Collapse in={combined.userListOpen} timeout="auto" unmountOnExit>
	        							<List component="div" disablePadding style={{width: '100%'}}>
	        								{ combined.allUsers && combined.allUsers.map(allUser => (
												<ListItem button 
														key={allUser.full_name}>
													<Link
														className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
														to={`/user/edit/${allUser.id}`}
														key={allUser.id}
													>
														{allUser.full_name}
													</Link>
												</ListItem>
	        									))}
	        							</List>
	      							</Collapse>
      							</div>
	                    }
    				</List>
    				<List
			      		style={{width: '100%'}}
			      	>
	                    {
	                        combined.posts && combined.posts.map(post => (
	                        	<div key={'userPost'+post.id}>
									<ListItem key={post.name} button onClick={() => handleClick(post.id)}>
										<ListItemIcon>
											{post.name}
										</ListItemIcon>
										<ListItemText/>
										{combined.openStatusSlots['open-user-'+post.id] ? <ExpandLess /> : <ExpandMore />}
									</ListItem>
	      							<Collapse key={post.id} in={combined.openStatusSlots['open-user-'+post.id]} timeout="auto" unmountOnExit>
	        							<List component="div" disablePadding style={{width: '100%'}}>
	        								{post.posts.map(userpost => (
												<ListItem button 
														key={userpost.title}>
													<Link
														className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
														to={`/post/edit/${userpost.id}`}
														key={userpost.id}
													>
														{userpost.title}
													</Link>
												</ListItem>
	        									))}
	        							</List>
	      							</Collapse>
      							</div>
	                    ))}
    				</List>
		       </Grid>
		    </Container>
		)
}
