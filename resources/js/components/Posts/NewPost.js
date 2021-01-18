 // resources/assets/js/components/NewPost.js

import axios from 'axios'
import React, { Component } from 'react'
import ReactQuill, { Quill }  from 'react-quill'; // ES6
import ImageUploader from "quill-image-uploader";
import swal from 'sweetalert';
import { withRouter } from "react-router";
import Autocomplete from '@material-ui/lab/Autocomplete';
import BookCitationList  from './BookCitationList';
import BookChapterSelectionModal from './BookChapterSelectionModal';
import { 
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
} from '@material-ui/core';
import { 
    PlaylistAdd as PlaylistAddIcon
} from '@material-ui/icons';


Quill.register("modules/imageUploader", ImageUploader);

class NewPost extends Component {

    state = {
        loading: true,
        books: [],
        chapters: [],
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
        published:false,
        open: false,
        bookSelectionModalOpen: false,
        bookSelectedId: null,
        chapterSelectedId:null,
        parentPostId:null,
        user: {},
        image: '',
        imagePreviewUrl: false
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

    formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "imageBlot" // #5 Optinal if using custom formats
    ];

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
        this.attachQuillRefs()
        const postId = (this.props.match.params.id) ? this.props.match.params.id : null;
        const parentPostId = (this.props.match.params.parentId) ? this.props.match.params.parentId : null;
        await this.loadData(postId, parentPostId);
    }

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            const postId = (this.props.match.params.id) ? this.props.match.params.id : null;
            const parentPostId = (this.props.match.params.parentId) ? this.props.match.params.parentId : null;
            await this.loadData(postId, parentPostId);
        }
    }

    async componentWillReceiveProps(nextProps) {
        const {
            post_id
        } = this.state;

        if (nextProps.match.params.id !== post_id) {
            await this.loadData(nextProps.match.params.id);
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

    loadData = async (postId = null, parentPostId=null) => {
        let tagOptions = [];

        let {
            token,
            user
        } = this.state; 

        try {

            let tagRes = await axios.get('/api/tags', 
                {
                    headers: {
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    }
                });
            let tags = tagRes.data;
            
            tags.forEach(function(tag){
                let temp = {};
                temp['id'] = tag.id;
                temp['value'] = tag.title;
                tagOptions.push(temp);
            });

            let appState = JSON.parse(localStorage["appState"]);

            let newState = {
                loading:false,
                tags: tagOptions,
                user_id:appState.user.id,
                parentPostId:parentPostId
            };

            if(postId !== null){
                let postObj = await axios.get('/api/posts/'+postId, 
                    {
                        headers: {
                            'Authorization': 'Bearer '+token,
                            'Accept': 'application/json'
                        }
                    }
                );

                let postData = postObj.data;

                newState['title'] = postData['title'];
                newState['content'] = postData['content'];
                newState['post_id'] = postData['id'];
                newState['image'] = postData['image'];
                newState['published'] = postData['published'] ? true : false;

            }

            let userBooks = await axios.get('/api/books/showUserBooks', 
            {
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Accept': 'application/json'
                },
                params: {
                    userId: user.id
                }
            });

            const books = userBooks.data;

            newState['books'] = books;
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

        const { 
            book_title_search_term,
            token,
        } = this.state;

        await axios.get('/api/books/searchByTitle', 
        {
            headers: {
                'Authorization': 'Bearer '+token,
                'Accept': 'application/json'
            },
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
        
        const { 
            category_id,
            content,
            post_id,
            published,
            selectedTags,
            slug,
            title,
            token,
            user_id,
            parentPostId,
            image,
        } = this.state;

        const post = {
            id: post_id ? post_id : null,
            title: title,
            slug: slug,
            published: published,
            content: content,
            category_id: category_id,
            selectedTags: selectedTags,
            user_id: user_id,
            parentPostId,
            image
        };

        if (post_id){
            let results = await axios.post('/api/posts/'+post_id,
                { 
                    data: post,
                    _method: 'patch'                  
                },
                {   
                    headers: {
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    }
                }
            );
            swal("Done!", "Post Updated.", "success");
        } else {

            let results = await axios.post('/api/posts/',
                post,
                {   
                    headers: {
                        'Authorization': 'Bearer '+token,
                        'Accept': 'application/json'
                    }
                }
            );
            swal("Done!", "Post Created.", "success");
            this.props.history.push(`/post/edit/${results.data.id}`);
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

    handleClose = async () => {
        this.setState({
            bookSelectionModalOpen:false
        });
    };

    handleOpenChapterSelectionModal = async () => {

        this.setState({ 
            bookSelectionModalOpen:true, 
        });
    };

    handleBookChapterSelect = async (event) => {

        let { 
            books,
            bookSelectedId
        } = this.state;

        let selectorName = event.target.name;
        let bookCitations = '';
        let chapters = [];
        let citations = [];

        if(event.target.value == 0){
            this.setState({
                book_title:'',
                bookSelectedId:null,
                chapterSelectedId:null,
                chapters:[],
                citations: [],
                chapterSelectionModalOpen: false
            });
            return;
        }

        if(selectorName === 'book'){
            bookSelectedId = event.target.value;

            let selectedBook = books.find(book => book.id == bookSelectedId);
            if(selectedBook.chapters != null && selectedBook.chapters.length > 0){
                chapters = selectedBook.chapters;
                this.setState({
                    book_title:selectedBook.title,
                    bookSelectedId:bookSelectedId,
                    chapters: chapters,
                });
            } else {
                citations = selectedBook.citations;
                this.setState({
                    book_title:selectedBook.title,
                    bookSelectedId:bookSelectedId,
                    chapterSelectedId:null,
                    chapters:[],
                    citations: citations,
                    chapterSelectionModalOpen: false
                });
            }
        }


        if(selectorName === 'chapter'){
            let chapterSelectedId = event.target.value;
            let selectedBook = books.find(book => book.id == bookSelectedId);
            let bookCitations = selectedBook.citations;
            let citations = [];

            for (let key in bookCitations) {
                if (bookCitations[key].chapter == chapterSelectedId) {
                    citations.push(bookCitations[key]);
                }
            }

            this.setState({
                book_title:selectedBook.title,
                chapterSelectedId:chapterSelectedId,
                citations: citations,
                chapterSelectionModalOpen: false
            });

        }
    };

    onChange = (e) => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
        return;
        this.createImage(files[0]);
    }

    createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            this.setState({
                image: e.target.result
            })
        };
        reader.readAsDataURL(file);
    }

    render () {
        let { 
            bookSelectedId,
            bookSelectionModalOpen,
            books,
            book_title,
            book_title_search_term,
            category_id,
            chapters,
            chapterSelectedId,
            citations,
            content,
            post_id,
            published,
            slug,
            tags,
            title,
            imagePreviewUrl
        } = this.state;

        const buttonTitle = (post_id) ? 'Update' : 'Create';
        const headerTitle = (post_id) ? 'Update' : 'Create New';

        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>{headerTitle} Post</div>
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
                                            value={title}
                                            style={{ width:'100%' }}
                                        />
                                        {this.renderErrorFor('title')}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl 
                                        
                                                style={{ width:'100%' }}>
                                            <Autocomplete
                                                multiple
                                                id="selectedTags"
                                                options={tags}
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
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={published}
                                                    onChange={this.handleChkboxToggle}
                                                    name="published"
                                                    color="primary"
                                                />
                                            }
                                            label="Publish"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <h2>Insert Blog Header Image</h2>
                                        <input className="input_imagem_artigo" type="file" onChange={this.onChange} />
                                        <div className="imgPreview">
                                            { 
                                                imagePreviewUrl ?  (<img className="add_imagem" Name="add_imagem" src={imagePreviewUrl} />) : ( 'Upload image' )
                                            }
                                        </div>
                                    </Grid>

                                </Grid>
                                <Grid item xs={6}>
                                    <Grid style={{'textAlign':'center', 'marginLeft':'-85px'}} item xs={12}>
                                        <div>
                                            <img style={{'width':'400px'}} src={this.state.image} />
                                        </div>
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
                                        handleOpenChapterSelectionModal={this.handleOpenChapterSelectionModal}
                                        citations={citations}
                                        handleClick={this.handleClick}
                                    />
                                </Grid>
                                <Grid item xs={8} style={{padding:'10px'}}>
                                    <ReactQuill 
                                        theme="snow"
                                        modules={this.modules}
                                        value={content}
                                        formats={this.formats}
                                        ref={(el) => { this.reactQuillRef = el }}
                                        onChange={this.handleEditorChange} 
                                        style={{height:'725px', maxHeight:'725px', overflow:'scroll'}}
                                    />
                                    {this.renderErrorFor('content')}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button style={{float:'right'}} type="submit" variant="contained" color="primary" >
                                       {buttonTitle}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        <BookChapterSelectionModal 
                            books={books}
                            chapters={chapters}
                            bookSelectionModalOpen={bookSelectionModalOpen} 
                            bookSelectedId={bookSelectedId}
                            chapterSelectedId={chapterSelectedId}
                            handleBookChapterSelect={this.handleBookChapterSelect}
                            handleClose={this.handleClose} 
                        />
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default withRouter(NewPost);

