import React, { useState } from 'react';
import { 
    Button,
    Container,
    Divider,
    TextField,
    Grid,
} from '@material-ui/core';
import ReplyBox  from '../Comments/ReplyBox';

export default function ReplyList(props) {

    const [replyBoxAppear, handleReplyBoxAppear] = useState(false);


    const handleReplySubmit = async (reply, commentId, userId, token) => {
        console.log(reply);
        console.log(commentId);
        console.log(userId);

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
        swal("Done!", "Reply added.", "success");
        this.setState({ 
            replyBoxAppear:!replyBoxAppear,
        });
    }

    let {
        comment,
    } = props;

    let replyBox = <div></div>;

    if (replyBoxAppear) {
      replyBox = <div>
                    <ReplyBox handleReplySubmit={handleReplySubmit} handleReplyBoxAppear={handleReplyBoxAppear} commentId={comment.id}/>
                </div>
    } else {
      replyBox =  <Button style={{float:'right'}} type="submit" variant="contained" color="primary" onClick={() => handleReplyBoxAppear(true)}>
                    Reply
                  </Button>
    }

    console.log(comment.replies);
    return (
        <Grid item key={`comment-${comment.id}`} xs={12}>
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
                {comment.replies && comment.replies.map(reply => (
                    <Grid item key={`reply-${reply.id}`} xs={12}>
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
                <Divider />
            </div>
        </Grid>
    );
}