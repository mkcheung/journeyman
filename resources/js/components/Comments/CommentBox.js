import React, { useState } from 'react';
import { 
    Button,
    TextField,
} from '@material-ui/core';

export default function CommentBox(props) {
    const [comment, setComment] = useState("");

    let {
        handleCommentBoxAppear,
        handleCommentSubmit
    } = props;
    return (
        <div>
            <TextField 
                id='comment' 
                title='comment' 
                onChange={e => setComment(e.target.value)} 
                value={comment}
                style = {{width:'1225px'}}
            />
            <div style = {{marginTop:'50px'}}>
                <Button style={{float:'right'}} type="submit" variant="contained" color="primary" onClick={() => {handleCommentSubmit(comment)}}>
                    Add Comment
                </Button>
                <Button style={{float:'right', marginRight:'10px'}} type="submit" variant="contained" color="primary" onClick={handleCommentBoxAppear}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}