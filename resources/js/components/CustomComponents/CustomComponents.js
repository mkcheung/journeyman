import React, {Component} from 'react'
import { 
	Button,
	Switch,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { createMuiTheme, withStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';

const IOSSwitch = withStyles((theme) => ({
	root: {
		width: 42,
		height: 26,
		padding: 0,
		margin: theme.spacing(1),
	},
	switchBase: {
		padding: 1,
		'&$checked': {
			transform: 'translateX(16px)',
			color: theme.palette.common.white,
			'& + $track': {
				backgroundColor: 'darkslategrey',
				opacity: 1,
				border: 'none',
			},
		},
		'&$focusVisible $thumb': {
			color: 'darkslategrey',
			border: '6px solid #fff',
		},
	},
	thumb: {
		width: 24,
		height: 24,
	},
	track: {
		borderRadius: 26 / 2,
		border: `1px solid ${theme.palette.grey[400]}`,
		backgroundColor: theme.palette.grey[50],
		opacity: 1,
		transition: theme.transitions.create(['background-color', 'border']),
	},
	checked: {},
	focusVisible: {},
}))(({ classes, ...props }) => {
	return (
		<Switch
			focusVisibleClassName={classes.focusVisible}
			disableRipple
			classes={{
				root: classes.root,
				switchBase: classes.switchBase,
				thumb: classes.thumb,
				track: classes.track,
				checked: classes.checked,
			}}
			{...props}
		/>
	);
});

const ColorDeleteButton = withStyles((theme) => ({
	root: {
		color: theme.palette.getContrastText('#890824'),
		backgroundColor: '#890824',
		'&:hover': {
			backgroundColor: '#890824',
		},
	},
}))(Button);

const ColorEditButton = withStyles((theme) => ({
	root: {
		color: theme.palette.getContrastText('#724470'),
		backgroundColor: '#724470',
		'&:hover': {
			backgroundColor: '#724470',
		},
	},
}))(Button);

export { ColorDeleteButton, ColorEditButton, IOSSwitch };