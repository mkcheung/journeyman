 // resources/assets/js/components/NewPost.js

import axios from 'axios'
import React, { Component } from 'react'
import ReactQuill, { Quill }  from 'react-quill'; // ES6
import ImageUploader from "quill-image-uploader";
import swal from 'sweetalert';
import {withRouter} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BookCitationList  from './BookCitationList';
import { 
    Box,
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

class ShowPost extends Component {

    state = {
        loading: true,
        post_id: null,
        content:'',
        title: '',
        open: false,
        user: {},
    };

    constructor(props) {
        super(props);
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
        const postId = (this.props.match.params.id) ? this.props.match.params.id : null;
        await this.loadData(postId);
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            const postId = (this.props.match.params.id) ? this.props.match.params.id : null;
            await this.loadData(postId);
        }
    }
  

    loadData = async (postId = null) => {
        try {

            let appState = JSON.parse(localStorage["appState"]);

            let newState = {
                loading:false,
                user_id:appState.user.id
            };

            if(postId !== null){

                let postObj = await axios.get('/api/posts/getUserPosts', 
                {
                    headers: {
                        'Authorization': 'Bearer '+this.state.token,
                        'Accept': 'application/json'
                    },
                    params: {
                        userId: appState.user.id
                    }
                });


                let postData = postObj.data;
                console.log(postData);

                newState['title'] = postData[0]['title'];
                newState['content'] = postData[0]['content'];
                newState['post_id'] = postData[0]['id'];

            }
            this.setState(newState);

        } catch (error) {
            console.log(error);
        }
    };

    render () {
        let { 
            post_id,
            title,
            content
        } = this.state;

        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>{title}</div>
                    </Grid>
                    <Grid item xs={12}>
                        <Box component="span" display="block" p={1} m={1} bgcolor="background.paper" dangerouslySetInnerHTML={{__html: content}}>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default ShowPost;

