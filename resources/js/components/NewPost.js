 // resources/assets/js/components/NewPost.js

import axios from 'axios'
import React, { Component } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BookCitationList  from './BookCitationList';
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

class NewPost extends Component {

    state = {
        loading: true,
        categories: [],
        citations: [],
        tags:[],
        errors: [],
        book_title:'',
        book_title_search_term:'',
        content:'',
        title: '',
        selectedTags:[],
        slug:'',
        publish:false,
        open: false,
    };

    async componentDidMount () {
        await this.loadData();
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            await this.loadData();
        }
    }

    loadData = async () => {

        let categoryOptions = [];
        let tagOptions = [];
        try {

            let tagRes = await axios.get('/api/tags');
            let tags = tagRes.data;
            
            tags.forEach(function(tag){
                let temp = {};
                temp['id'] = tag.id;
                temp['value'] = tag.title;
                tagOptions.push(temp);
            });

            let categoryRes = await axios.get('/api/categories');
            let categories = categoryRes.data;
            
            categories.forEach(function(category){
                let temp = []
                temp['id'] = category.id;
                temp['value'] = category.title;
                categoryOptions.push(temp);
            });

            this.setState( {
                categories: categoryOptions,
                loading:false,
                tags: tagOptions
            });

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

    handleGetCitations = async (e) => {

        e.preventDefault();

        this.setState({
            loading: true
        });

        axios.get('/api/books/searchByTitle', {
            params: {
                    bookTitle: this.state.book_title_search_term
                }
            }).then(res => {

            let bookCitations = res.data[0].citations;
            let book_title = res.data[0].title;

            this.setState({
                loading: false,
                book_title: book_title,
                citations: bookCitations
            });
        })
        .catch(error => {
            console.log('stopped');
            return error;
        });
    }

    onTagsChange = (event, values) => {
        this.setState({
            selectedTags: values
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
            category_id: this.state.category_id,
            selectedTags: this.state.selectedTags
        };

        axios.post('/api/posts', post)
        .then(response => {
            // redirect to the homepage
            // history.push('/')
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
        let { book_title, book_title_search_term, citations} = this.state;

        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>Create New Post</div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.handleCreateNewPost}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="name">Title:</InputLabel>
                                        <TextField 
                                            id="title" 
                                            title='title' 
                                            onChange={this.handleFieldChange} 
                                            value={this.state.title}
                                        />
                                        {this.renderErrorFor('title')}
                                    </Grid>
                                    <Grid item xs={12}>
                                            <InputLabel htmlFor="name">Slug:</InputLabel>
                                            <TextField 
                                                id="slug" 
                                                title='slug' 
                                                onChange={this.handleFieldChange} 
                                                aria-describedby="my-helper-text" 
                                                value={this.state.slug}
                                            />
                                            {this.renderErrorFor('slug')}
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
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid item xs={12}>
                                        <FormControl >
                                            <Autocomplete
                                                multiple
                                                id="selectedTags"
                                                options={this.state.tags}
                                                getOptionLabel={(option) => option.value}
                                                onChange={this.onTagsChange}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Tags"
                                                        placeholder="Favorites"
                                                    />
                                                )}
                                            />
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
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={4}>  
                                    <BookCitationList 
                                        book_title={book_title}
                                        book_title_search_term={book_title_search_term} 
                                        handleFieldChange={this.handleFieldChange}
                                        handleGetCitations={this.handleGetCitations}
                                        citations={citations}
                                    />
                                </Grid>
                                <Grid item xs={8}>
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

                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary" >
                                        Create
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

export default NewPost;