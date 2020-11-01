// resources/assets/js/components/App.js

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route, Switch, HashRouter, Redirect, useHistory } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Login from './Auth/Login';
import Register from './Auth/Register';
import NotFound from './NotFound';
// User is LoggedIn
import PrivateRoute from './Routes/PrivateRoute';
import ProtectedRoute from './Routes/ProtectedRoute';
import AdminDashboard from './Home/AdminDashboard';
import Dashboard from './Home/Dashboard';
import NewTag from './Tags/NewTag';
import SingleTag from './Tags/SingleTag';
import TagsList from './Tags/TagsList';
import NewPost from './Posts/NewPost';
import PostsList from './Posts/PostsList';
import ShowPost from './Posts/ShowPost';
import RecentBlog from './Home/RecentBlog';
import UserBlog from './Users/UserBlog';
import UserEdit from './Users/UserEdit';
import NewCategory from './Categories/NewCategory';
import CategoriesList from './Categories/CategoriesList';
import UserBookList from './Users/UserBookList';

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
            temp['full_name'] = author.full_name;
            blogAuthors.push(temp);
        });

        if (state && blogAuthors) {
            let AppState = JSON.parse(state);

            this.setState({
                isLoggedIn: AppState.isLoggedIn, 
                user: AppState.user, 
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
					user: AppState.user,
		        });
		    } else {
		        this.setState({
					openMenu:this.state.openMenu,
					isLoggedIn: false,
					user: {}
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

            let { id, name, full_name, first_name, last_name, email, access_token, roles, permissions, rolesAndPermissions, userSpecificPermissions } = loggedInData.data;


            let userData = {
                id,
                name,
                full_name,
                first_name,
                email,
                access_token,
                last_name,
                permissions,
                roles,
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

    handleUserProfileUpdate = async (event, updatedUser) => {
        event.preventDefault();

        let user = updatedUser;
        user['full_name'] = user['first_name'] + ' ' + user['last_name'];
        if (user.id){
            let results = await axios.post('/api/users/'+user.id,
                { 
                    data: user,
                    _method: 'patch'                  
                },
                {   
                    headers: {
                        'Authorization': 'Bearer '+user.access_token,
                        'Accept': 'application/json'
                    }
                }
            );


            let state = localStorage["appState"];
            let AppState = JSON.parse(state);
            let userPriorState = AppState.user;

            let userNewState = {
                ...userPriorState,
                ...user
            }
            let newAppState = {
                isLoggedIn: true,
                user: userNewState
            };
            localStorage["appState"] = JSON.stringify(newAppState);

            await this.setState({
                user:userNewState
            });

            swal("Done!", "User Updated.", "success");
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

        // passed down methods to protected routes
        let pdm =  {
            handleUserProfileUpdate:this.handleUserProfileUpdate
        }

		return (
			<HashRouter>
				<Header anchorEl={anchorEl} blogAuthors={blogAuthors} token={user.access_token} user={user} isLoggedIn={isLoggedIn} handleClick={this.handleClick} handleClose={this.handleClose} openMenu={openMenu} /> 
					<Switch>
                        <Route exact path='/' component={RecentBlog} />
						<Route exact path='/login' render={(loginProps) => (<Login handleLogin={this.handleLogin} isLoggedIn={isLoggedIn} userRole={role}/>)} />
						<Route exact path='/register' component={Register}/>
                        <Route exact path='/user/getPosts/:id' component={UserBlog} />
                        <Route exact path='/post' component={PostsList} />
                        <Route exact path='/post/show/:id' component={ShowPost} />
                        <ProtectedRoute exact path='/adminDashboard' perform="admins-only" component={AdminDashboard}/>
                        <ProtectedRoute exact path='/dashboard' perform="home-list" component={Dashboard}/>
                        <ProtectedRoute exact path='/dashboard/:id' perform="home-list" component={Dashboard}/>
						<ProtectedRoute exact path='/post/create' perform="post-create" component={NewPost} />
                        <ProtectedRoute exact path='/post/edit/:id' perform="post-edit" component={NewPost} />
                        <ProtectedRoute exact path='/user/edit/:id' perform="user-edit" pdm={pdm} component={UserEdit}/>
						<ProtectedRoute exact path='/tag' perform="tag-list" component={TagsList} />
						<ProtectedRoute exact path='/tag/create' perform="tag-create" component={NewTag} />
                        <ProtectedRoute exact path='/book/getUserBooks' perform="book-list" component={UserBookList} />
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




