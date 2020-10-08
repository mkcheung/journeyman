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
    TextField,
    Toolbar,
    Typography
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
		paddingTop:'12px'
	},
	titleAndUserSelect: {
		display: 'inherit',
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

	handleInputChange = (event, value) => {
		// NOTE THAT PATH WILL NOT CHANGE, JUST THE PARAMETER
		// IT IS HANDLED IN componentWillReceiveProps WITHIN USERBLOG.JS
		this.props.history.push(`/user/getPosts/${value.id}`);
	}

    render() {
        const aStyle = {
			cursor: 'pointer'
        };

        let { isLoggedIn, handleClick, handleClose, openMenu, classes, theme, blogAuthors } = this.props;


        let dropdownOptions = '<div></div>';
        if(blogAuthors && blogAuthors.length>0){
	        dropdownOptions =
		        <div className={classes.titleAndUserSelect}> 
					<Typography variant="h6" noWrap className={classes.title}>
						Phronesis Project
					</Typography>
					<div className={classes.search}>
						<Autocomplete
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							options={blogAuthors}
		  					getOptionLabel={(blogAuthor) => blogAuthor.name}
		  					style={{ width: 300 }}
							onChange={this.handleInputChange}
							renderInput={(params) => 
								<TextField {...params} label="Search for a writer..." variant="outlined" />
							}
						/>
					</div>
				</div>;
        }
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
					{dropdownOptions}
        		</Toolbar>
			</AppBar>
        );
    }
}
export default withStyles(styles)(withRouter(Header));