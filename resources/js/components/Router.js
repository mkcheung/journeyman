import React from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom';
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
const Main = props => (
<Switch>
	{/*User might LogIn*/}
	<Route exact path='/' component={Home}/>
	{/*User will LogIn*/}
	<Route path='/login' component={Login}/>
	<Route path='/register' component={Register}/>
	{/* User is LoggedIn*/}
	<PrivateRoute path='/dashboard' component={Dashboard}/>
	{/*Page Not Found*/}
	<PrivateRoute component={NotFound}/>
	<PrivateRoute exact path='/' component={PostsList} />
	<PrivateRoute path='/post/create' component={NewPost} />
	<PrivateRoute path='/tag/create' component={NewTag} />
	<PrivateRoute path='/category/create' component={NewCategory} />
	<PrivateRoute path='/:id' component={SingleTag} />
</Switch>
);
export default Main;