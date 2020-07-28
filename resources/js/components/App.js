// resources/assets/js/components/App.js

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Link, Route, Switch, HashRouter} from 'react-router-dom'
import Home from './Home';
import Login from './Login';
import Register from './Register';
import NotFound from './NotFound'
// User is LoggedIn
import PrivateRoute from './PrivateRoute'
import Dashboard from './Dashboard';
import Header from './Header'
import NewTag from './NewTag'
import TagsList from './TagsList'
import PostsList from './PostsList'
import NewPost from './NewPost'
import SingleTag from './SingleTag'
import NewCategory from './NewCategory'
import CategoriesList from './CategoriesList'

class App extends Component {
	render () {
		return (
			<HashRouter>
				<Switch>
					<Route exact path='/login' component={Login}/>
					<Route exact path='/register' component={Register}/>
					<PrivateRoute exact path='/' component={Dashboard}/>
					<PrivateRoute exact path='/post' component={PostsList} />
					<PrivateRoute exact path='/post/create' component={NewPost} />
					<PrivateRoute exact path='/tag' component={TagsList} />
					<PrivateRoute exact path='/tag/create' component={NewTag} />
					<PrivateRoute exact path='/category' component={CategoriesList} />
					<PrivateRoute exact path='/category/create' component={NewCategory} />
					<PrivateRoute exact path='/:id' component={SingleTag} />
					<PrivateRoute component={NotFound}/>
				</Switch>
			</HashRouter>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))