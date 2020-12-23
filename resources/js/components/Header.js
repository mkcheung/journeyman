import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {Link, withRouter, Redirect, useHistory} from 'react-router-dom';
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
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { 
    Search as SearchIcon,
    PersonPin as PersonPinIcon
}from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
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
    paddingTop:'10px'
  },
    titleAndUserSelect: {
        display: 'inherit',
    flexGrow: 1,
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
}));

const navOpsLoggedIn = [
    {
        name: 'Dashboard',
        route: '/dashboard'
    },
    {
        name: 'Posts',
        route: '/post'
    },
    {
        name: 'Books',
        route: '/book/getUserBooks'
    },
    {
        name: 'Categories',
        route: '/category'
    },
    {
        name: 'Tags',
        route: '/tag'
    },
];
const navOpsLoggedOut = [
    {
        name: 'Home',
        route: '/'
    },
];

const ITEM_HEIGHT = 48;

export default function Header(props) {

    let {
        blogAuthors,
        handleClick,
        handleClose,
        isLoggedIn,
        openMenu,
        token,
        user
    } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const history = useHistory();

    const handleLogOut = () => {
        localStorage.clear();
        handleClose();
        history.push('/');
    }

    const handleInputChange = (event, value) => {
        if(value === null){
            history.push(`/`);
        } else {
            history.push(`/user/getPosts/${value.id}`);
        }
    }

    const handleSetUserProfile = async (event) => {
        event.preventDefault();

        history.push(`/user/edit/${user.id}`);
    }

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    let navOps = [];
    
    if(isLoggedIn){
        navOps = navOpsLoggedIn;
    } else {
        navOps = navOpsLoggedOut;
    }

    let loggedInUserName = '';
    if(user.full_name && user.full_name.length>0){
        loggedInUserName = 
            <div style={{color:'white'}}>

                <IconButton style={{color:'white'}} onClick={(e) => handleSetUserProfile(e)}>
                    <PersonPinIcon /> 
                    <h6>
                        Welcome {user.full_name}!
                    </h6>
                </IconButton>
            </div>;
    }

    let dropdownOptions = '';
    if(blogAuthors && blogAuthors.length>0){
        dropdownOptions =
            <div className={classes.titleAndUserSelect}> 
                <div className={classes.search}>
                    <Autocomplete
                        classes={{
                            root: classes.inputRoot,
                            input: classes.inputInput,
                        }}
                        options={blogAuthors}
                        getOptionLabel={(blogAuthor) => blogAuthor.full_name}
                        style={{ width: 300 }}
                        onChange={handleInputChange}
                        renderInput={(params) => 
                            <TextField {...params} variant="outlined" />
                        }
                    />
                </div>
            </div>;
    }


    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            id="long-menu"
            anchorEl={anchorEl}
            keepMounted
            className={classes.title}
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
                <div>
                    <MenuItem key={'login'}>
                        <Link to="/login">
                            Login
                        </Link>  
                    </MenuItem>
                    <MenuItem key={'register'}>
                        <Link to="/register">
                            Register
                        </Link>
                    </MenuItem>
                </div>
            :   <MenuItem key={'logout'}>
                    <MUILINK href="#" onClick={handleLogOut}>
                        Logout
                    </MUILINK>
                </MenuItem>
            }
        </Menu>
    );

  return (
    <div className={classes.grow}>
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
                <Typography className={classes.title} variant="h6" noWrap>
                    Phronesis Project
                </Typography>
                {dropdownOptions}
                {renderMenu}
                {loggedInUserName}
            </Toolbar>
        </AppBar>
    </div>
  );
}