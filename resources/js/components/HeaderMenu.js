import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { 
    Link as MUILINK,
    Menu,
    MenuItem,
}  from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';

const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];

const navOps = [
    {
        name: 'Dashboard',
        route: '/'
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

export default function LongMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
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
            {!props.loggedIn ?
                <MenuItem key={'login'}>
                    <Link to="/login">
                        Login
                    </Link> | <Link to="/register">Register</Link>
                </MenuItem>
            :   <MenuItem key={'logout'}>
                    <MUILINK href="#" onClick={props.logOut}>
                        Logout
                    </MUILINK>
                </MenuItem>
            }
          </Menu>
        </div>
    );
}