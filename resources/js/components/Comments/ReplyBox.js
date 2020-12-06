import axios from 'axios';
import React, { useState } from 'react';
import { 
    Button,
    TextField,
} from '@material-ui/core';

export default function ReplyBox(props) {
    const [reply, setReply] = useState("");
    let appState = JSON.parse(localStorage["appState"]);
    let userId = appState.user.id;
    let token = appState.user.access_token;

    let {
        commentId,
        handleReplyBoxAppear,
        handleReplySubmit
    } = props;
    return (
        <div>
            <TextField 
                id='reply' 
                title='reply' 
                onChange={e => setReply(e.target.value)} 
                value={reply}
                style = {{width:'1225px'}}
            />
            <div style = {{marginTop:'50px'}}>
                <Button style={{float:'right'}} type="submit" variant="contained" color="primary" onClick={() => {handleReplySubmit(reply, commentId, userId, token)}}>
                    Add Reply
                </Button>
                <Button style={{float:'right', marginRight:'10px'}} type="submit" variant="contained" color="primary" onClick={() => handleReplyBoxAppear(false)}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}