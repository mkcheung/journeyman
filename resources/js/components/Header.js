// resources/assets/js/components/Header.js

import React, {Component} from 'react'
import {Link, withRouter, Redirect} from 'react-router-dom';
import { 
	AppBar,
    Button,
    IconButton,
    InputBase,
    Link as MUILINK,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import { fade, withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	search: {
		position: 'relative',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
		marginRight: theme.spacing(2),
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(3),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: '20ch',
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
});

class Header extends Component {
	state = {
		// isLoggedIn: false,
		// user: {}
	};

	constructor(props) {
		super(props);
		this.handleLogOut = this.handleLogOut.bind(this);
	}

	handleLogOut() {
        let { handleClose } = this.props;
		localStorage.clear();
		handleClose();
		this.props.history.push('/login');
	}

    render() {
        const aStyle = {
			cursor: 'pointer'
        };

        let { isLoggedIn, handleClick, handleClose, openMenu, classes, theme } = this.props;

        return (
        	<AppBar position="static">
        		<Toolbar>
		            <IconButton
		                aria-label="more"
		                aria-controls="long-menu"
		                aria-haspopup="true"
		                onClick={handleClick}
		            >
		                <MenuIcon />
		            </IconButton>
		            <Menu
		                id="long-menu"
		                keepMounted
		                open={openMenu}
		                onClose={handleClose}
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
					<Typography variant="h6" noWrap>
						Phronesis Project
					</Typography>
					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
					<InputBase
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ 'aria-label': 'search' }}
					/>
					</div>
        		</Toolbar>
			</AppBar>
        );
    }
}
export default withStyles(styles)(withRouter(Header));