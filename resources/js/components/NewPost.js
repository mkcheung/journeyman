 // resources/assets/js/components/NewPost.js

import axios from 'axios'
import React, { Component } from 'react'
import ReactQuill from 'react-quill'; // ES6
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
        post_id: null,
        book_title:'',
        book_title_search_term:'',
        content:'',
        title: '',
        selectedTags:[],
        slug:'',
        publish:false,
        open: false,
    };
    static quillModules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
    ]
  }
      /* ... other modules */

  static  _quillFormats = [ 
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video'
      ];

  constructor(props) {
    super(props);

    this.quillRef = null;
    this.reactQuillRef = null;
  }
    // reactQuillRef = React.createRef();

    async componentDidMount () {
        this.attachQuillRefs()

        const postId = (this.props.match.params.id) ? this.props.match.params.id : null;
        await this.loadData(postId);
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            await this.loadData();
        }
    }
  
    attachQuillRefs = () => {
    // Ensure React-Quill reference is available:

        if (typeof this.reactQuillRef.getEditor !== 'function') return;
        // Skip if Quill reference is defined:
        if (this.quillRef != null) return;

        const quillRef = this.reactQuillRef.getEditor();

        if (quillRef != null) this.quillRef = quillRef;
    }

    loadData = async (postId = null) => {

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


            let newState = {
                categories: categoryOptions,
                loading:false,
                tags: tagOptions
            };

            if(postId !== null){
                let postObj = await axios.get('/api/posts/'+postId);

                let postData = postObj.data;

                newState['title'] = postData['title'];
                newState['content'] = postData['content'];
                newState['post_id'] = postData['id'];
                newState['publish'] = postData['published'] ? true : false;

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

        let citationBlock = e.currentTarget;

        const citationText = '"' + citationBlock.getElementsByClassName("citationText")[0].innerText + '", <i>' + citationBlock.getElementsByClassName("title")[0].innerText + '</i>, ' + citationBlock.getElementsByClassName("page")[0].innerText;


        // must focus before calling getSelection
        this.quillRef.focus();
        var range = this.quillRef.getSelection();
        
        let position = range ? range.index : 0;
        this.quillRef.insertText(position, citationBlock.getElementsByClassName("page")[0].innerText );
        this.quillRef.insertText(position, citationBlock.getElementsByClassName("title")[0].innerText + ', ', {
            'italic': true
        });
        this.quillRef.insertText(position, '"' + citationBlock.getElementsByClassName("citationText")[0].innerText + '", ', {
            'italic': false
        });


    }


    handleGetCitations = async (e) => {

        e.preventDefault();

        this.setState({
            loading: true
        });
        const { book_title_search_term } = this.state;

        axios.get('/api/books/searchByTitle', {
            params: {
                    bookTitle: book_title_search_term
                }
            }).then(res => {

            let bookCitations = (res.data[0]) ? res.data[0].citations : [] ;
            let book_title = (res.data[0]) ? res.data[0].title : [] ;

            this.setState({
                loading: false,
                book_title: book_title,
                citations: bookCitations
            });
        })
        .catch(error => {
            return error;
        });
    }

    onTagsChange = (event, values) => {
        this.setState({
            selectedTags: values
        });
    }

    handleCreateUpdatePost = async (event) => {
        event.preventDefault();

        const { history } = this.props;

        const post = {
            id: this.state.post_id ? this.state.post_id : null,
            title: this.state.title,
            slug: this.state.slug,
            publish: this.state.publish,
            content: this.state.content,
            category_id: this.state.category_id,
            selectedTags: this.state.selectedTags
        };

        if (this.state.post_id){
            let results = await axios.patch('/api/posts/'+this.state.post_id, post);
        } else {
            let results = await axios.post('/api/posts', post);
        }

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
        let { 
            book_title,
            book_title_search_term,
            citations,
            post_id
        } = this.state;

        const buttonTitle = (post_id) ? 'Update' : 'Create';

        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>Create New Post</div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.handleCreateUpdatePost}>
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
                            <Grid container style={{height:'775px'}}>
                                <Grid item xs={4} style={{padding:'10px'}}>  
                                    <BookCitationList 
                                        book_title={book_title}
                                        book_title_search_term={book_title_search_term} 
                                        handleFieldChange={this.handleFieldChange}
                                        handleGetCitations={this.handleGetCitations}
                                        citations={citations}
                                        handleClick={this.handleClick}
                                    />
                                </Grid>
                                <Grid item xs={8} style={{padding:'10px'}}>
                                    <ReactQuill 
                                        value={this.state.content}
                                        ref={(el) => { this.reactQuillRef = el }}
                                        onChange={this.handleEditorChange} 
                                        theme="snow"
                                        style={{height:'90%'}}
                                    />
                                    {this.renderErrorFor('content')}
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

export default NewPost;