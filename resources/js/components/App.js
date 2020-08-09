// resources/assets/js/components/App.js

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Switch, HashRouter} from 'react-router-dom'
import Footer from './Footer';
import Header from './Header';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound'
// User is LoggedIn
import PrivateRoute from './PrivateRoute'
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
		user: {}
    };

	// check if user is authenticated and storing authentication data as states if true
	componentWillMount() {
		let state = localStorage["appState"];

		if (state) {
			let AppState = JSON.parse(state);
			this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState.user });
		}
	}
	render () {
		return (
			<HashRouter>
	        	<Header userData={this.state.user} userIsLoggedIn={this.state.isLoggedIn}/>
					<Switch>
						<Route exact path='/login' component={Login}/>
						<Route exact path='/register' component={Register}/>
						<PrivateRoute exact path='/' component={Dashboard}/>
						<PrivateRoute exact path='/post' component={PostsList} />
						<PrivateRoute exact path='/post/create' component={NewPost} />
						<PrivateRoute exact path='/post/edit/:id' component={NewPost} />
						<PrivateRoute exact path='/tag' component={TagsList} />
						<PrivateRoute exact path='/tag/create' component={NewTag} />
						<PrivateRoute exact path='/category' component={CategoriesList} />
						<PrivateRoute exact path='/category/create' component={NewCategory} />
						<PrivateRoute exact path='/:id' component={SingleTag} />
						<PrivateRoute component={NotFound}/>
					</Switch>
	        	<Footer/>
			</HashRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))