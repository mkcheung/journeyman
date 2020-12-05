import React, { useState } from 'react';
import { 
    Button,
    Container,
    Divider,
    TextField,
    Grid,
} from '@material-ui/core';

export default function CommentList(props) {

    let {
        comments
    } = props;
    
    return (
        <Container maxWidth="lg">
            <Grid container spacing={3}>
                {comments.map(comment => (
                    <Grid item key={`comment-${comment.id}`} xs={12}>
                        <div>
                            <div>
                                <u>
                                    <strong>
                                        {comment.user.full_name }
                                    </strong>
                                </u>
                                <span> </span>
                                {comment.created_at}
                            </div>
                            <div>
                                {comment.comment}
                            </div>
                            <Divider />
                        </div>
                    </Grid>
                ))}
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {commBox}
                </Grid>
            </Grid>
        </Container>
    );
}