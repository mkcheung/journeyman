import axios from 'axios';
import React, { useState } from 'react';
import { 
    Chip,
    Button,
    TextareaAutosize,
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
            <TextareaAutosize
                id='reply' 
                title='reply' 
                onChange={e => setReply(e.target.value)} 
                value={reply}
                style = {{ width:'1125px', marginLeft:'60px'}}
                rowsMin={5}
            />
            <div style = {{marginTop:'25px'}}>
                <Chip size='small' label='Add Reply' style={{float:'right', marginLeft:'15px'}} onClick={() => handleReplySubmit(reply, commentId, userId, token)}/>
                <Chip size='small' label='Cancel' style={{float:'right', marginRight:'10px'}} onClick={() => handleReplyBoxAppear(false)}/>
            </div>
        </div>
    );
}