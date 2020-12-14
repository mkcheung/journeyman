import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { 
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    TextareaAutosize,
} from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import {withRouter} from 'react-router';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';

export default function RecentBlog() {
    const [recentPosts, setPosts] = useState([]);

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
        loadData();
    }, []);

    return (
            <div className="container">
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
            </div>
    )
}
