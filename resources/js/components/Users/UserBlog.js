import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { 
    Button,
    Chip,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    TextareaAutosize,
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Link, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { makeStyles } from '@material-ui/core/styles';


    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
            inputInputForTags: {
            padding: theme.spacing(1, 1, 1, 0),
        },
    }));

    function useMergeState(initialState) {
        const [state, setState] = useState(initialState);
        const setMergedState = newState => 
            setState(prevState => Object.assign({}, prevState, newState)
        );
        return [state, setMergedState];
    }

export default function UserBlog(props) {


    const classes = useStyles();


    const [combined, setCombined] = useMergeState({
        posts: [],
        user: {},
    });

    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, selectTags] = useState([]);

    useEffect( () => {
        async function loadData(userId){
            let userObj = await axios.get('/api/users/showUserBlogPosts', 
            {
                headers: {
                    'Accept': 'application/json'
                },
                params: {
                    userId: userId
                }
            });

            let userData = userObj.data;
            let tempUser = userData[0];
            await setCombined({
                posts: userData[0]['posts'],
                user: userData[0]
            });
        }
        loadData(props.match.params.id);
    }, [props.match.params.id]);


    useEffect( () => {
        async function loadTagsOptions(){
            let tagOptions = [];

            let tagRes = await axios.get('/api/tags/showTags', 
                {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            let tags = tagRes.data;
            
            tags.forEach(function(tag){
                let temp = {};
                temp['id'] = tag.id;
                temp['value'] = tag.title;
                tagOptions.push(temp);
                setTagOptions(tagOptions);
            });
        }
        loadTagsOptions();
    }, []);

    const handleTagSelection = async (event, values) => {
        selectTags(values);
    }

    const handleTagSubmit = async () => {

        let userId = props.match.params.id;
        let userObj = await axios.get('/api/users/showUserBlogPosts', 
        {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                userId: userId,
                tags: selectedTags
            }
        });

        let userData = userObj.data;
        let tempUser = userData[0];
        await setCombined({
            posts: userData[0]['posts'],
            user: userData[0]
        });
    }

    let userBlogEntries = <div></div>;
    if(combined.posts.length > 0){
        userBlogEntries = 
                    <div>
                        {
                            combined.posts.length && combined.posts.map(post => (
                            <div key={`userpost-${post.id}`}>
                                <h2>
                                    <Link
                                        to={`/post/show/${post.id}`}
                                        key={post.id}
                                    >
                                        {post.title}
                                    </Link>
                                    <HTMLEllipsis
                                        unsafeHTML={post.content}
                                        maxLine='3'
                                        ellipsis='...'
                                        basedOn='letters'
                                    />
                                </h2>
                                Author: {combined.user.full_name}
                                <br/>
                                Posted: {post.created_at}
                                <hr/>
                            </div>
                        ))}
                    </div>
    }

    return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={8}>
                        {userBlogEntries}
                    </Grid>
                    <Grid item xs={3}>
                        <div style={{marginTop:'100px'}}>
                            <Autocomplete
                                id='tags'
                                freeSolo
                                multiple
                                classes={{
                                    input: classes.inputInputForTags,
                                }}
                                options={tagOptions}
                                getOptionLabel={(tagOption) => tagOption.value}
                                style={{ 
                                     width: 300 }}
                                renderInput={(params) => 
                                    <TextField 
                                        {...params} 
                                        label="Search Posts With Tags:"
                                    />
                                }
                                onChange={handleTagSelection}
                            />
                        </div>
                        <Chip
                            label='Search'
                            onClick={() => handleTagSubmit()}
                        />
                    </Grid>
                </Grid>
            </div>
    )
}
