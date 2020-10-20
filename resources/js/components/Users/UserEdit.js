 // resources/assets/js/components/UserEdit.js

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


  modules = {
    // #3 Add "image" to the toolbar
    toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
    ],
    // # 4 Add module and upload function
    imageUploader: {
      upload: file => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("image", file);

          fetch(
            "https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22",
            {
              method: "POST",
              body: formData
            }
          )
            .then(response => response.json())
            .then(result => {
              resolve(result.data.url);
            })
            .catch(error => {
              reject("Upload failed");
              console.error("Error:", error);
            });
        });
      }
    }
  };

    constructor(props) {
        super(props);

        this.quillRef = null;
        this.reactQuillRef = null;
    }
    // reactQuillRef = React.createRef();

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
        const userId = (this.props.match.params.id) ? this.props.match.params.id : null;
        await this.loadData(userId);
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            const userId = (this.props.match.params.id) ? this.props.match.params.id : null;
            await this.loadData(userId);
        }
    }

    loadData = async (userId = null) => {
        let categoryOptions = [];
        let tagOptions = [];
        try {

            if(userId !== null){
                let userObj = await axios.get('/api/users/'+userId, 
                    {
                        headers: {
                            'Authorization': 'Bearer '+this.state.token,
                            'Accept': 'application/json'
                        }
                    }
                );

                let user = userObj.data;
console.log(userObj);
console.log(user);
                newState['user'] = user;
            }
            this.setState(newState);

        } catch (error) {
            console.log(error);
        }
    };

    handleFieldChange = async (event) => {
        this.setState({
            [event.target.id]: event.target.value,
            [event.target.slug]: event.target.value,
            [event.target.content]: event.target.value,
            [event.target.category_id]: event.target.value,
            [event.target.book_title_search_term]: event.target.value,
        });
    }

    handleClick = (e) => {
        e.preventDefault();


    }

    onTagsChange = (event, values) => {
        this.setState({
            selectedTags: values
        });
    }

    handleCreateUpdatePost = async (event) => {

    }

    hasErrorFor = (field) => {
        return !!this.state.errors[field]
    }

    renderErrorFor = (field) => {
        if(this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleChange = async (event) => {

        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        });
    };

    handleChkboxToggle = async (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.checked
        });
    };

    render () {
        let { 
            user
        } = this.state;

        let {name} = user ? user : null;
console.log(name);
        const buttonTitle = 'Update';

        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>User Profile</div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.handleCreateUpdatePost}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <InputLabel htmlFor="name">Title:</InputLabel>
                                    <TextField 
                                        id="name" 
                                        title='name' 
                                        onChange={this.handleFieldChange} 
                                        value={name}
                                    />
                                    {this.renderErrorFor('name')}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button  style={{float:'right'}} type="submit" variant="contained" color="primary" >
                                       {buttonTitle}
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

