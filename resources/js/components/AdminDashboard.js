import axios from 'axios'
import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
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

class AdminDashboard extends Component {
    state = {
		isLoggedIn: false,
        loading: true,
        post_id: [],
		user: {},
		allUsers: [],
		posts: [],
		userListOpen: false,
		openStatusSlots: {}
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

    handleClick = (postId) => {
		let { 
			openStatusSlots, 
		} = this.state;

		openStatusSlots['open-user-'+postId] = !(openStatusSlots['open-user-'+postId]);

        this.setState({
			openStatusSlots
        })
    }

    handleUserListClick = () => {
		let { 
			userListOpen, 
		} = this.state;

		
        this.setState({
			userListOpen: !userListOpen
        })
    }


    loadData = async (userId) => {

        let allUsers = await axios.get('/api/users/', 
        {
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            }
        });

        console.log(allUsers);

        let postsObj = await axios.get('/api/posts/', 
        {
        	headers: {
                'Authorization': 'Bearer '+this.state.token,
                'Accept': 'application/json'
            },
            params: {
                userId: userId
            }
        });


	    let postData = postsObj.data;
	    let openStatusSlots = {};
	    postData.map(function(pd){
	    	openStatusSlots['open-user-'+pd.id] = false;
	    });

        this.setState({
            loading:false,
            posts: postData,
            openStatusSlots,
            allUsers:allUsers.data
        });
	}

	render() {

		let { 
			isLoggedIn,
			allUsers,
			posts,
			user,
			openStatusSlots,
			userListOpen
		} = this.state;
	    

        if (isLoggedIn === false) {
            this.props.history.push('/login');
		}

	    return (
	    	<Container maxWidth="lg">
		      	<Grid container>
    				<List
			      		style={{width: '100%'}}
			      	>
	                    {
	                        	<div>
									<ListItem button onClick={() => this.handleUserListClick()}>
										<ListItemIcon>
											Users
										</ListItemIcon>
										<ListItemText/>
										{userListOpen ? <ExpandLess /> : <ExpandMore />}
									</ListItem>
	      							<Collapse in={userListOpen} timeout="auto" unmountOnExit>
	        							<List component="div" disablePadding style={{width: '100%'}}>
	        								{ allUsers && allUsers.map(allUser => (
												<ListItem button 
														key={allUser.name}>
													<Link
														className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
														to={`/user/edit/${allUser.id}`}
														key={allUser.id}
													>
														{allUser.name}
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
	                        posts && posts.map(post => (
	                        	<div key={'userPost'+post.id}>
									<ListItem key={post.name} button onClick={() => this.handleClick(post.id)}>
										<ListItemIcon>
											{post.name}
										</ListItemIcon>
										<ListItemText/>
										{openStatusSlots['open-user-'+post.id] ? <ExpandLess /> : <ExpandMore />}
									</ListItem>
	      							<Collapse key={post.id} in={openStatusSlots['open-user-'+post.id]} timeout="auto" unmountOnExit>
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
}
export default withRouter(AdminDashboard)