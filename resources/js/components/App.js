// resources/assets/js/components/App.js

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Switch, HashRouter, Redirect, useHistory } from 'react-router-dom'
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound'
// User is LoggedIn
import PrivateRoute from './PrivateRoute'
import ProtectedRoute from './ProtectedRoute'
import Dashboard from './Dashboard';
import NewTag from './NewTag'
import TagsList from './TagsList'
import PostsList from './PostsList'
import NewPost from './NewPost'
import SingleTag from './SingleTag'
import NewCategory from './NewCategory'
import CategoriesList from './CategoriesList'

class App extends Component {
    state = {
		isLoggedIn: false,
		user: {},
		formSubmitting:false,
		openMenu: false
    };

	constructor() {
		super();
	}

    componentDidMount() {
		let state = localStorage["appState"];
		console.log(state);
		if (state) {
			let AppState = JSON.parse(state);
			console.log(AppState);
			this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
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
					user: AppState
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
    	console.log('handleClick');
    	event.preventDefault();
        this.setState({
			openMenu:true
        });
    };

    handleClose = () => {
        this.setState({
			openMenu:false,
        });
    };


    handleLogin = (event) => {
    
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;
        this.setState({formSubmitting: true});
        this.loginUser(email, password);
    }

    loginUser = (email, password) => {

        let userData = {
            email,
            password
        };
        axios.post("/api/auth/login", userData).then(response => {
              return response;
        }).then(json => {;
            if (json.status == 200) {
                let userData = {
                    id: json.data.id,
                    name: json.data.name,
                    email: json.data.email,
                    access_token: json.data.access_token,
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
             }
             else {
                alert(`Our System Failed To Register Your Account!`);
             }
        }).catch(error => {if (error.response) {
            // The request was made and the server responded with a status code that falls out of the range of 2xx
            let err = error.response.data;
            this.setState({
              error: err.message,
              errorMessage: err.errors,
              formSubmitting: false
            })
          }
          else if (error.request) {
            // The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
            let err = error.request;
            this.setState({
              error: err,
              formSubmitting: false
            })
         } else {
           // Something happened in setting up the request that triggered an Error
           let err = error.message;
           this.setState({
             error: err,
             formSubmitting: false
           })
       }
     }).finally(this.setState({error: ''}));
    }


	render () {

		let { 
			isLoggedIn,
			openMenu 
		} = this.state;

		let HideHeader = isLoggedIn ? <Header isLoggedIn={isLoggedIn} handleClick={this.handleClick} handleClose={this.handleClose} openMenu={openMenu}/> : null ; 

		return (
			<HashRouter>
				{HideHeader}
					<Switch>
						<Route exact path='/' render={(loginProps) => (<Login handleLogin={this.handleLogin} isLoggedIn={isLoggedIn} />)} />
						<Route exact path='/register' component={Register}/>
						<ProtectedRoute exact path='/dashboard' component={Dashboard}/>
						<ProtectedRoute exact path='/post' component={PostsList} />
						<ProtectedRoute exact path='/post/create' component={NewPost} />
						<ProtectedRoute exact path='/post/edit/:id' component={NewPost} />
						<ProtectedRoute exact path='/tag' component={TagsList} />
						<ProtectedRoute exact path='/tag/create' component={NewTag} />
						<ProtectedRoute exact path='/category' component={CategoriesList} />
						<ProtectedRoute exact path='/category/create' component={NewCategory} />
						<ProtectedRoute exact path='/:id' component={SingleTag} />
						<ProtectedRoute component={NotFound}/>
					</Switch>
	        	<Footer/>
			</HashRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))




