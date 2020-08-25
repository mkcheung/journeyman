// resources/assets/js/components/Header.js

import React, {Component} from 'react'
import {Link, withRouter, Redirect} from 'react-router-dom';
import { 
	AppBar,
    Button,
    IconButton,
    Link as MUILINK,
    Menu,
    MenuItem,
    Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const navOps = [
    {
        name: 'Dashboard',
        route: '/dashboard'
    },
    {
        name: 'Categories',
        route: '/category'
    },
    {
        name: 'Tags',
        route: '/tag'
    },
    {
        name: 'Posts',
        route: '/post'
    },
];
const ITEM_HEIGHT = 48;

class Header extends Component {
	state = {
		openMenu: false,
		isLoggedIn: false,
		user: {}
	};

	componentWillMount(){

		let state = localStorage["appState"];
		if (state) {
			let AppState = JSON.parse(state);
			console.log(AppState);
			this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
		}
	}

	constructor(props) {
		super(props);
		this.handleLogOut = this.handleLogOut.bind(this);
	}

	handleLogOut() {
		localStorage.clear();
		this.setState({isLoggedIn: false, user: {}});
		this.props.history.push('/login');
	}

    handleClick = (event) => {
        this.setState({
			openMenu:true
        });
    };

    handleClose = () => {
        this.setState({
			openMenu:false
        });
    };

    render() {
        const aStyle = {
			cursor: 'pointer'
        };

        let { isLoggedIn } = this.state;

        return (
        	<AppBar position="static">
        		<Toolbar>
		            <IconButton
		                aria-label="more"
		                aria-controls="long-menu"
		                aria-haspopup="true"
		                onClick={this.handleClick}
		            >
		                <MenuIcon />
		            </IconButton>
		            <Menu
		                id="long-menu"
		                keepMounted
		                open={this.state.openMenu}
		                onClose={this.handleClose}
		                PaperProps={{
		                    style: {
		                        maxHeight: ITEM_HEIGHT * 4.5,
		                        width: '20ch',
		                    },
		                }}
		            >
			            {navOps.map((navOp) => (
			                <MenuItem key={navOp.name}>
			                    <Link to={navOp.route}>{navOp.name}</Link>
			                </MenuItem>
			            ))}
			            {!isLoggedIn ?
			                <MenuItem key={'login'}>
			                    <Link to="/login">
			                        Login
			                    </Link> | <Link to="/register">Register</Link>
			                </MenuItem>
			            :   <MenuItem key={'logout'}>
			                    <MUILINK href="#" onClick={this.handleLogOut}>
			                        Logout
			                    </MUILINK>
			                </MenuItem>
			            }
		          	</Menu>
        		</Toolbar>
			</AppBar>
        );
    }
}
export default withRouter(Header)