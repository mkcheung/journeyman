 // resources/assets/js/components/NewPost.js

import axios from 'axios'
import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { 
    Button,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    InputLabel,
    Select,
    TextField
} from '@material-ui/core';

class NewPost extends Component {

    state = {
        loading: true,
        categories: [],
        tags:[],
        errors: [],
        content:'',
        title: '',
        tag:'',
        slug:'',
        publish:false,
        open: false,
    };

    componentDidMount () {
        axios.get('/api/tags').then(res => {

            let tagOptions = [];
            let tags = res.data;

            tags.forEach(function(tag){
                let temp = []
                temp['id'] = tag.id;
                temp['value'] = tag.title;
                tagOptions.push(temp);
            });

            this.setState( {
                tags: tagOptions
            });
        })
        .catch(error => {
            return error;
        });

        axios.get('/api/categories').then(res => {

            let categoryOptions = [];
            let categories = res.data;

            categories.forEach(function(category){
                let temp = []
                temp['id'] = category.id;
                temp['value'] = category.title;
                categoryOptions.push(temp);
            });

            this.setState({
                categories: categoryOptions
            });
        })
        .catch(error => {
            return error;
        });
    }

    handleFieldChange = async (event) => {
        this.setState({
            [event.target.id]: event.target.value,
            [event.target.slug]: event.target.value,
            [event.target.content]: event.target.value,
            [event.target.category_id]: event.target.value
        });
    }

    handleCreateNewPost = async (event) => {
        event.preventDefault();

        const { history } = this.props;

        const post = {
            title: this.state.title,
            slug: this.state.slug,
            publish: this.state.publish,
            content: this.state.content,
            category_id: this.state.category_id
        };

        axios.post('/api/posts', post)
        .then(response => {
            // redirect to the homepage
            history.push('/')
        })
        .catch(error => {
            this.setState({
              errors: error.response.data.errors
            })
        })
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

    handleEditorChange = async (content, editor) => {
        this.setState({
            ...this.state,
            ['content']: content,
        });
    }

    render () {
        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>Create New Post</div>
                    </Grid>
                    <form onSubmit={this.handleCreateNewPost}>
                        <Grid item xs={12}>
                            <div>
                                <InputLabel htmlFor="name">Title:</InputLabel>
                                <TextField 
                                    id="title" 
                                    title='title' 
                                    onChange={this.handleFieldChange} 
                                    aria-describedby="my-helper-text" 
                                    value={this.state.title}
                                />
                                {this.renderErrorFor('title')}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <InputLabel htmlFor="name">Slug:</InputLabel>
                                <TextField 
                                    id="slug" 
                                    title='slug' 
                                    onChange={this.handleFieldChange} 
                                    aria-describedby="my-helper-text" 
                                    value={this.state.slug}
                                />
                                {this.renderErrorFor('slug')}
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.publish}
                                        onChange={this.handleChkboxToggle}
                                        name="publish"
                                        color="primary"
                                    />
                                }
                                label="Publish"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl >
                                <InputLabel htmlFor="age-native-simple">Tags</InputLabel>
                                <Select
                                    native
                                    value={this.state.tag}
                                    onChange={this.handleChange}
                                    inputProps={{
                                        name: 'age',
                                        id: 'age-native-simple',
                                    }}
                                >
                                <option value='0'></option>
                                {
                                    Object
                                    .keys(this.state.tags)
                                    .map(key => <option key={key} value = {this.state.tags[key].id}>{this.state.tags[key].value}</option>)
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl >
                                <InputLabel htmlFor="age-native-simple">Category</InputLabel>
                                <Select
                                    native
                                    value={this.state.category_id}
                                    onChange={this.handleChange}
                                    title='category_id'
                                    inputProps={{
                                        name: 'age',
                                        id: 'age-native-simple',
                                    }}
                                >
                                <option value='0'></option>
                                {
                                    Object
                                    .keys(this.state.categories)
                                    .map(key => <option key={key} value = {this.state.categories[key].id}>{this.state.categories[key].value}</option>)
                                }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Editor
                                initialValue="<p>This is the initial content of the editor</p>"
                                title='content'
                                init={{
                                height: 500,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar:
                                    'undo redo | formatselect | bold italic backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help'
                                }}
                                onEditorChange={this.handleEditorChange}
                            />
                            {this.renderErrorFor('content')}
                        </Grid>

                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" >
                                Create
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Container>
        );
    }
}

export default NewPost;