import React, { useState } from 'react';
import { 
    Button,
    Chip,
    Container,
    Divider,
    TextField,
    Grid,
} from '@material-ui/core';
import ReplyBox  from '../Comments/ReplyBox';

export default function ReplyList(props) {
    const [replyBoxAppear, handleReplyBoxAppear] = useState(false);
    const [repliesToComment, setRepliesToComment] = useState('');


    const handleReplySubmit = async (reply, commentId, userId, token) => {

        const replyObj = {
            user_id:userId,
            comment_id: commentId,
            reply: reply,
        };

        let results = await axios.post('/api/replies/',
            replyObj,
            {   
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Accept': 'application/json'
                }
            }
        );
        setRepliesToComment(results.data);
        handleReplyBoxAppear(false);
    }

    let {
        comment,
    } = props;

    let replies = repliesToComment.length > 0 ? repliesToComment : comment.replies;

    let replyBox = <div></div>;

    if (replyBoxAppear) {
      replyBox = <div>
                    <ReplyBox handleReplySubmit={handleReplySubmit} handleReplyBoxAppear={handleReplyBoxAppear} commentId={comment.id}/>
                </div>
    } else {
      replyBox =  
                  <Chip
                    label='Reply'
                    onClick={() => handleReplyBoxAppear(true)}
                    style={{marginLeft:'50px', marginBottom:'25px'}}
                  />
    }

    return (
        <Grid item key={`comment-${comment.id}`} xs={12} style={{marginBottom:'25px'}}>
            <div>
                <div>
                    <u>
                        <strong>
                            {comment.user.full_name}
                        </strong>
                    </u>
                    <span> </span>
                    {comment.created_at}
                </div>
                <div>
                    {comment.comment}
                </div>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {replyBox}
                    </Grid>
                </Grid>
                {replies && replies.map(reply => (
                    <Grid item key={`reply-${reply.id}`} style={{marginLeft:'60px'}}>
                        <div>
                            <u>
                                <strong>
                                    {reply.user.full_name}
                                </strong>
                            </u>
                            <span> </span>
                            {reply.created_at}
                        </div>
                        <div>
                            {reply.reply}
                        </div>
                    </Grid>
                ))}
            </div>
        </Grid>
    );
}