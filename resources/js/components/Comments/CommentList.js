import React, { useState } from 'react';
import { 
    Button,
    Container,
    Divider,
    TextField,
    Grid,
} from '@material-ui/core';
import ReplyList  from '../Comments/ReplyList';

export default function CommentList(props) {

    let {
        comments,
    } = props;

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                {comments.map(comment => (
                    <ReplyList key={`comment_replies-${comment.id}`}  comment={comment} />
                ))}
            </Grid>
        </Container>
    );
}