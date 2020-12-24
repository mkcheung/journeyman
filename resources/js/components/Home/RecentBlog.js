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

export default function RecentBlog() {
    const classes = useStyles();
    const [recentPosts, setPosts] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [selectedTags, selectTags] = useState([]);

    useEffect( () => {
        async function loadData(){
            let recentPostRes = await axios.get('/api/posts/getRecentPosts', 
            {
                headers: {
                    'Accept': 'application/json'
                }
            });

            let posts = recentPostRes.data;
            setPosts(posts);
        }
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
        loadData();
        loadTagsOptions();
    }, []);


    const handleTagSelection = async (event, values) => {
        selectTags(values);
    }

    const handleTagSubmit = async () => {

        let recentPostRes = await axios.get('/api/posts/getRecentPosts', 
        {
            headers: {
                'Accept': 'application/json'
            },
            params: {
                tags: selectedTags
            }
        });

        let posts = recentPostRes.data;
        setPosts(posts);
    }


    return (
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={8}>
                        {
                            recentPosts && recentPosts.map(post => (
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
                                Author: {post.user.full_name}
                                <br/>
                                Posted: {post.created_at}
                                <hr/>
                            </div>
                        ))}
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
