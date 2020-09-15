import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import FlashMessage from 'react-flash-message';
    
import { 
	Avatar,
	Box,
	Button,
	Checkbox,
	Container,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	InputLabel,
	Select,
	TextField
} from '@material-ui/core';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

class RegisterContainer extends Component {
  
	constructor(props) {
	    super(props);
	    this.state = {
			isRegistered: false,
			error: '',
			errorMessage: '',
			formSubmitting: false,
			user: {
			    name: '',
			    email: '',
			    password: '',
			    password_confirmation: '',
			    is_admin:false
			},
        	roles:[],
			redirect: props.redirect,
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleEmail = this.handleEmail.bind(this);
		this.handlePassword = this.handlePassword.bind(this);
		this.handlePasswordConfirm = this.handlePasswordConfirm.bind(this);

	}

	componentWillMount() {
		let state = localStorage["appState"];
		if (state) {
			let AppState = JSON.parse(state);
			this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState});
		}
		if (this.state.isRegistered) {
			return this.props.history.push("/dashboard");
		}
	}

	async componentDidMount() {
		const { prevLocation } = this.state.redirect.state || {prevLocation: { pathname: '/dashboard' } };
        await this.loadData();
		if (prevLocation && this.state.isLoggedIn) {
			return this.props.history.push(prevLocation);
		}
	}

    loadData = async () => {

        let roleOptions = [];
        try {
            let rolesRes = await axios.get('/api/roles');
            let roles = rolesRes.data;
            roles.forEach(function(role){
            	console.log(role);
                let temp = {};
                temp['id'] = role.id;
                temp['value'] = role.name;
                roleOptions.push(temp);
            });

            let newState = {
                roles: roleOptions,
            };
            this.setState(newState);
        } catch (error) {
            console.log(error);
        }
    };

	handleUserChkboxToggle = (event) => {
		this.setState({
			user:{
				...this.state.user, 
				[event.target.name]: event.target.checked
			}
		});
	};

	handleSubmit(e) {
		e.preventDefault();
		this.setState({formSubmitting: true});
		ReactDOM.findDOMNode(this).scrollIntoView();
		let userData = this.state.user;

		axios.post("/api/auth/signup", userData)
		.then(response => {
			return response;
		}).then(json => {
			if (json.data.success) {
				let userData = {
					id: json.data.id,
					name: json.data.name,
					email: json.data.email,
					activation_token: json.data.activation_token,
				};
				let appState = {
					isRegistered: true,
					user: userData
				};
				localStorage["appState"] = JSON.stringify(appState);
				this.setState({
					isRegistered: appState.isRegistered,
					user: appState.user
				});
			} else {
				alert(`Our System Failed To Register Your Account!`);
			}
		}).catch(error => {

			if (error.response) {
				// The request was made and the server responded with a status code that falls out of the range of 2xx
				let err = error.response.data;
				this.setState({
					error: err.message,
					errorMessage: err.errors,
					formSubmitting: false
				});
			} else if (error.request) {
				// The request was made but no response was received `error.request` is an instance of XMLHttpRequest in the browser and an instance of http.ClientRequest in node.js
				let err = error.request;
				this.setState({
					error: err,
					formSubmitting: false
				});
			} else {
				// Something happened in setting up the request that triggered an Error
				let err = error.message;
				this.setState({
					error: err,
					formSubmitting: false
				});
			}
		}).finally(this.setState({error: ''}));
	}

	handleEmail(e) {
	  let value = e.target.value;
	  this.setState(prevState => ({
	    user: {
	      ...prevState.user, email: value
	    }
	  }));
	}


    handleChange = async (event) => {

        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        });
    };


	handlePassword(e) {
	  let value = e.target.value;
	  this.setState(prevState => ({
	    user: {
	      ...prevState.user, password: value
	    }
	  }));
	}

	handlePasswordConfirm(e) {
	  let value = e.target.value;
	  this.setState(prevState => ({
	    user: {
	      ...prevState.user, password_confirmation: value
	    }
	  }));
	}

	render() {

		let errorMessage = this.state.errorMessage;
		let arr = [];
		Object.values(errorMessage).forEach((value) => (
			arr.push(value)
		));
		return (

			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div>
					<Typography component="h1" variant="h5">
						Create Your Account
					</Typography>
					<form noValidate>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							onChange={this.handleEmail}
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							onChange={this.handlePassword}
							autoComplete="current-password"
						/>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password_confirm"
							label="password_confirm"
							type="password_confirm"
							id="password_confirm"
							onChange={this.handlePasswordConfirm}
							autoComplete="current-password"
						/>
						<FormControlLabel
							control={
								<Checkbox 
		                            checked={this.state.user.is_admin}
		                            onChange={this.handleUserChkboxToggle}
                    				id='is_admin'
		                            name="is_admin"
		                            color="primary"
                            	/>
                            }
							label="Admin"
						/>
						<br/>
                        <FormControl >
                            <InputLabel htmlFor="age-native-simple">Role:</InputLabel>
                            <Select
                                native
                                onChange={this.handleChange}
                                title='role_id'
                                inputProps={{
                                    name: 'age',
                                    id: 'age-native-simple',
                                }}
                            >
                            <option value='0'></option>
                            {
                                Object
                                .keys(this.state.roles)
                                .map(key => <option key={key} value = {this.state.roles[key].id}>{this.state.roles[key].value}</option>)
                            }
                            </Select>
                        </FormControl>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
						>
							Sign In
						</Button>
					</form>
				</div>
			</Container>
			)
	}
}
// 2.8
export default withRouter(RegisterContainer);