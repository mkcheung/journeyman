import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Files from 'react-files'
import { 
	Button,
	Container,
	Grid,
	Paper,
	Switch,
	Tooltip,
} from '@material-ui/core';
import { 
	Delete as DeleteIcon,
	Edit as EditIcon,
	List as ListIcon,
	PlaylistAdd as PlaylistAddIcon
} from '@material-ui/icons';
import { 
	makeStyles
} from '@material-ui/core/styles';
import HTMLEllipsis from 'react-lines-ellipsis/lib/html';
import { 
	ColorDeleteButton,
	ColorEditButton,
	IOSSwitch 
} from './../CustomComponents/CustomComponents';
import { Link, useHistory } from 'react-router-dom';

function useMergeState(initialState) {
    const [state, setState] = useState(initialState);
    const setMergedState = newState => 
        setState(prevState => Object.assign({}, prevState, newState)
    );
    return [state, setMergedState];
}

export default function NewPost(props) {

    let user = {};
    let token = '';
    let state = localStorage["appState"];

    if (state) {
        let appState = JSON.parse(state);
        user = appState.user;
        token = user.access_token;
     }

    const history = useHistory();
    const [loading, setLoading] = useState(true);
    
    useEffect( () => {
        async function loadData(postId=null, parentPostId=null){
        }

    }, [props.match.params.id, props.match.params.parentId]);
        return (

            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>{headerTitle} Post</div>
                    </Grid>
                    <Grid item xs={12}>
                        <form onSubmit={this.handleCreateUpdatePost}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid item xs={12}>
                                        <InputLabel htmlFor="name">Title:</InputLabel>
                                        <TextField 
                                            id="title" 
                                            title='title' 
                                            onChange={this.handleFieldChange} 
                                            value={title}
                                            style={{ width:'100%' }}
                                        />
                                        {this.renderErrorFor('title')}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl 
                                            style={{ width:'100%' }}
                                        >
                                            <Autocomplete
                                                multiple
                                                id="selectedTags"
                                                options={tags}
                                                getOptionLabel={(option) => option.value}
                                                onChange={this.onTagsChange}
                                                renderTags={(selectedTags) => { 
                                                    console.log('hello')
                                                    console.log(selectedTags);
                                                    selectedTags.map((option, index) => (
                                                        <Chip variant="outlined" label={option} />
                                                    ))
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="standard"
                                                        label="Tags"
                                                        placeholder="Favorites"
                                                    />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={published}
                                                    onChange={this.handleChkboxToggle}
                                                    name="published"
                                                    color="primary"
                                                />
                                            }
                                            label="Publish"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                    <h2>Insert Blog Header Image</h2>
                                        <input className="input_imagem_artigo" type="file" onChange={this.onChange} />
                                        <div className="imgPreview">
                                            { 
                                                imagePreviewUrl ?  (<img className="add_imagem" Name="add_imagem" src={imagePreviewUrl} />) : ( 'Upload image' )
                                            }
                                        </div>
                                    </Grid>

                                </Grid>
                                <Grid item xs={6}>
                                    <Grid style={{'textAlign':'center', 'marginLeft':'-85px'}} item xs={12}>
                                        <div>
                                            <img style={{'width':'400px'}} src={this.state.image} />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container style={{height:'775px'}}>
                                <Grid item xs={4} style={{padding:'10px'}}>  
                                    <BookCitationList 
                                        book_title={book_title}
                                        book_title_search_term={book_title_search_term} 
                                        handleFieldChange={this.handleFieldChange}
                                        handleGetCitations={this.handleGetCitations}
                                        handleOpenChapterSelectionModal={this.handleOpenChapterSelectionModal}
                                        citations={citations}
                                        handleClick={this.handleClick}
                                    />
                                </Grid>
                                <Grid item xs={8} style={{padding:'10px'}}>
                                    <ReactQuill 
                                        theme="snow"
                                        modules={this.modules}
                                        value={content}
                                        formats={this.formats}
                                        ref={(el) => { this.reactQuillRef = el }}
                                        onChange={this.handleEditorChange} 
                                        style={{height:'725px', maxHeight:'725px', overflow:'scroll'}}
                                    />
                                    {this.renderErrorFor('content')}
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Button style={{float:'right'}} type="submit" variant="contained" color="primary" >
                                       {buttonTitle}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>
                    <Grid item xs={12}>
                        <BookChapterSelectionModal 
                            books={books}
                            chapters={chapters}
                            bookSelectionModalOpen={bookSelectionModalOpen} 
                            bookSelectedId={bookSelectedId}
                            chapterSelectedId={chapterSelectedId}
                            handleBookChapterSelect={this.handleBookChapterSelect}
                            handleClose={this.handleClose} 
                        />
                    </Grid>
                </Grid>
            </Container>
        );
}