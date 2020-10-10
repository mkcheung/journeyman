// resources/assets/js/components/App.js

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch, HashRouter, Redirect, useHistory } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound';
// User is LoggedIn
import PrivateRoute from './PrivateRoute';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import NewTag from './NewTag';
import TagsList from './TagsList';
import PostsList from './PostsList';
import NewPost from './NewPost';
import ShowPost from './ShowPost';
import RecentBlog from './RecentBlog';
import UserBlog from './UserBlog';
import UserEdit from './UserEdit';
import SingleTag from './SingleTag';
import NewCategory from './NewCategory';
import CategoriesList from './CategoriesList';

class App extends Component {
    state = {
        anchorEl: null,
  		isLoggedIn: false,
  		user: {},
  		formSubmitting:false,
  		openMenu: false,
        blogAuthors:[]
    };

	constructor() {
		super();
	}

    async componentDidMount() {
        let state = localStorage["appState"];


        let blogAuthors = [];
        let authorRes = await axios.get('/api/users/showAuthors', 
            {
                headers: {
                    'Accept': 'application/json'
                }
            });
        authorRes.data.forEach(function(author){
            let temp = {};
            temp['id'] = author.id;
            temp['name'] = author.name;
            blogAuthors.push(temp);
        });
        
        if (state && blogAuthors) {
            let AppState = JSON.parse(state);
            this.setState({
                isLoggedIn: AppState.isLoggedIn, 
                user: AppState, 
                blogAuthors:blogAuthors
            });
        }
    }

	componentDidUpdate(prevProps, prevState) {
		if (prevState.openMenu !== this.state.openMenu) {
			let state = localStorage["appState"];

			if(state) {
                let AppState = JSON.parse(state);
		        this.setState({
					openMenu:this.state.openMenu,
					isLoggedIn: AppState.isLoggedIn,
					user: AppState,
		        });
		    } else {
		        this.setState({
					openMenu:this.state.openMenu,
					isLoggedIn: false,
					user: {},
                    blogAuthors:[]
		        });
		    }
		}
	}

    handleClick = (event) => {
    	event.preventDefault();
        this.setState({
			openMenu:true,
            anchorEl: event.target

        });
    };

    handleClose = () => {
        this.setState({
			openMenu:false,
            anchorEl: null 
        });
    };


    handleLogin = (event) => {
    
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        this.setState({formSubmitting: true});
        this.loginUser(email, password);
    }

    loginUser = async (email, password) => {

        let userData = {
            email,
            password
        };
        let loggedInData = await axios.post("/api/auth/login", userData);

        if (loggedInData.status == 200) {

            let { id, name, email, access_token, roles, permissions, rolesAndPermissions, userSpecificPermissions } = loggedInData.data;


            let userData = {
                id,
                name,
                email,
                access_token,
                roles,
                permissions,
                rolesAndPermissions: JSON.parse(rolesAndPermissions),
                userSpecificPermissions,
            };
            let appState = {
                isLoggedIn: true,
                user: userData
            };
            localStorage["appState"] = JSON.stringify(appState);
            this.setState({
                isLoggedIn: appState.isLoggedIn,
                user: appState.user,
                error: ''
            });
        } else {
            alert(`Our System Failed To Register Your Account!`);
            this.setState({
                error: '',
                formSubmitting: false
            })
        }
    }

	render () {

		let { 
            anchorEl,
			isLoggedIn,
			openMenu,
            user,
            blogAuthors,
		} = this.state;

        let role = user.roles ? user.roles[0] : '';

		// let HideHeader = isLoggedIn ? <Header anchorEl={anchorEl} blogAuthors={blogAuthors} token={user.access_token} isLoggedIn={isLoggedIn} handleClick={this.handleClick} handleClose={this.handleClose} openMenu={openMenu} /> : null ; 

		return (
			<HashRouter>
				<Header anchorEl={anchorEl} blogAuthors={blogAuthors} token={user.access_token} isLoggedIn={isLoggedIn} handleClick={this.handleClick} handleClose={this.handleClose} openMenu={openMenu} /> 
					<Switch>
                        <Route exact path='/' component={RecentBlog} />
						<Route exact path='/login' render={(loginProps) => (<Login handleLogin={this.handleLogin} isLoggedIn={isLoggedIn} userRole={role}/>)} />
						<Route exact path='/register' component={Register}/>
                        <Route exact path='/user/getPosts/:id' component={UserBlog} />
                        <Route exact path='/post' component={PostsList} />
                        <Route exact path='/post/show/:id' component={ShowPost} />
                        <ProtectedRoute exact path='/adminDashboard' perform="admins-only" component={AdminDashboard}/>
						<ProtectedRoute exact path='/dashboard' perform="home-list" component={Dashboard}/>
						<ProtectedRoute exact path='/post/create' perform="post-create" component={NewPost} />
                        <ProtectedRoute exact path='/post/edit/:id' perform="post-edit" component={NewPost} />
                        <ProtectedRoute exact path='/user/edit/:id' perform="user-edit" component={UserEdit} />
						<ProtectedRoute exact path='/tag' perform="tag-list" component={TagsList} />
						<ProtectedRoute exact path='/tag/create' perform="tag-create" component={NewTag} />
						<ProtectedRoute exact path='/category' perform="category-list" component={CategoriesList} />
						<ProtectedRoute exact path='/category/create' perform="category-create" component={NewCategory} />
						<ProtectedRoute exact path='/:id' perform="post-list" component={SingleTag} />
						<ProtectedRoute component={NotFound}/>
					</Switch>
	        	<Footer/>
			</HashRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))




