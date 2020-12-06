 // resources/assets/js/components/NewPost.js

import axios from 'axios';
import React, { Component } from 'react';
import ReactQuill, { Quill }  from 'react-quill'; // ES6
import ImageUploader from "quill-image-uploader";
import swal from 'sweetalert';
import {withRouter} from 'react-router-dom';
import Autocomplete from '@material-ui/lab/Autocomplete';
import BookCitationList  from './BookCitationList';
import CommentBox  from '../Comments/CommentBox';
import CommentList  from '../Comments/CommentList';
import { 
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    Divider,
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
        image: null,
        open: false,
        showCommentBox: false,
        user: {},
        comments:[]
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
            loading,
            comments
        } = this.state;

        if ((prevState.loading === true) || (prevState.comments != comments)) {
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

                let postObj = await axios.get(`/api/posts/show/${postId}`, 
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                let postData = postObj.data;
                newState['title'] = postData['title'];
                newState['content'] = postData['content'];
                newState['post_id'] = postData['id'];
                newState['image'] = postData['image'];
                newState['comments'] = postData['comments'];

            }
            this.setState(newState);

        } catch (error) {
            console.log(error);
        }
    };

    handleCommentBoxAppear = async () => {
        let { 
            showCommentBox,
        } = this.state;

        showCommentBox = !showCommentBox;

        this.setState({ 
            showCommentBox:showCommentBox,
        });
    };

    handleCommentSubmit = async (commentText) => {
        let { 
            post_id,
            showCommentBox,
            token,
            user,
        } = this.state;

        const comment = {
            post_id:post_id,
            commentText: commentText,
            user_id: user.id,
        };

        let results = await axios.post('/api/comments/',
            comment,
            {   
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Accept': 'application/json'
                }
            }
        );
        swal("Done!", "Comment added.", "success");
        this.setState({ 
            showCommentBox:!showCommentBox,
            comments:results.data
        });
    };

    render() {
        let { 
            post_id,
            title,
            comments,
            content,
            showCommentBox,
            image
        } = this.state;


        const buttonTitle = (post_id) ? 'Update' : 'Create';

        let commBox = <div></div>;

        if (showCommentBox) {
          commBox = <div>
                        <CommentBox handleCommentSubmit={this.handleCommentSubmit} handleCommentBoxAppear={this.handleCommentBoxAppear} />
                    </div>
        } else {
          commBox =  <Button style={{float:'right'}} type="submit" variant="contained" color="primary"  onClick={this.handleCommentBoxAppear}>
                        Comment
                     </Button>
        }


        let listOfComments = '';

        if(comments && comments.length>0){
            console.log(comments);
            listOfComments = <CommentList comments={comments}/>
        }
        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <Box component="span" display="block" p={1} m={1} bgcolor="background.paper" >

                            <h4>
                                <div style={{textAlign:'center'}}>
                                    <u>
                                        {title}
                                    </u><br/>
                                    <img style={{'width':'600px'}}src={image} />
                                </div>
                            </h4>
                            <div dangerouslySetInnerHTML={{__html: content}}>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {commBox}
                    </Grid>
                </Grid>
                {listOfComments}
            </Container>
        );
    }
}

export default ShowPost;

