import axios from 'axios'
import React, { Component } from 'react'
import ReactQuill, { Quill }  from 'react-quill'; // ES6
import ImageUploader from "quill-image-uploader";
import swal from 'sweetalert';
import {withRouter} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { 
    Button,
    Checkbox,
    Chip,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from '@material-ui/core';


Quill.register("modules/imageUploader", ImageUploader);

class UserEdit extends Component {

    state = {
        user: {},
    };

    constructor(props) {
        super(props);
        this.handleUserProfileUpdate = props.handleUserProfileUpdate.bind(this);
    }

    async componentDidMount () {
        let state = localStorage["appState"];

        if (state) {
            let appState = JSON.parse(state);
            this.setState(
                { 
                    isLoggedIn: appState.isLoggedIn,
                    user: appState.user,
                    token: appState.user.access_token,
                    rolesAndPermissions:appState.user.rolesAndPermissions,
                    userSpecificPermissions:appState.user.userSpecificPermissions,
                }
            );
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            await this.loadData(userId);
        }
    }

    loadData = async () => {
    };

    handleFieldChange = async (event) => {

        let {
            user
        } = this.state;

        this.setState({
            user: {
                ...user,
                [event.target.id]: event.target.value
            }
        });
    }

    handleClick = (e) => {
        e.preventDefault();
    }

    handleChange = async (event) => {

        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        });
    };

    render () {
        let { 
            user
        } = this.state;

        return (
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>User Profile</div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={(e) => this.handleUserProfileUpdate(e, user)}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="name">Username:</InputLabel>
                                    <TextField 
                                        id="name" 
                                        title='name' 
                                        onChange={this.handleFieldChange} 
                                        value={user.name}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>
                                    <InputLabel htmlFor="first_name">First Name:</InputLabel>
                                    <TextField 
                                        id="first_name" 
                                        title='first_name' 
                                        onChange={this.handleFieldChange} 
                                        value={user.first_name}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputLabel htmlFor="last_name">Last Name:</InputLabel>
                                    <TextField 
                                        id="last_name" 
                                        title='last_name' 
                                        onChange={this.handleFieldChange} 
                                        value={user.last_name}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="email">Email:</InputLabel>
                                    <TextField 
                                        id="email" 
                                        title='email' 
                                        onChange={this.handleFieldChange} 
                                        value={user.email}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button  style={{float:'right'}} type="submit" variant="contained" color="primary" >
                                       Update
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default UserEdit;

