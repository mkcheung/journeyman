  // resources/assets/js/components/TagsList.js

import axios from 'axios'
import React, { Component } from 'react'
import swal from 'sweetalert';
import { Link } from 'react-router-dom'
import  NewTagModal  from './NewTagModal';
import { 
    Container,
    Grid,
    Modal,
    Paper
} from '@material-ui/core';

class TagsList extends Component {

        state = {
            loading: true,
            errors: [],
            tags: [],
            open: false,
            newTag: {
                title: '',
                description: '',
                slug: ''
            }
        };

    async componentDidUpdate(prevProps, prevState) {
        const {
            loading
        } = this.state;

        if (prevState.loading === true) {
            await this.loadData();
        }
    }

    loadData = async () => {

        try {
            await axios.get('/api/tags').then(response => {
                this.setState({
                    loading: false,
                    tags: response.data
                });
            })

        } catch (error) {
            swal.fire({
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 2000,
            });
        }
    };

    handleFieldChange = async (event) => {

        let { state, newTag } = this.state;
        newTag[event.target.id] = event.target.value
        this.setState({
            ...state,
            newTag:newTag
        });
    }

    handleOpen = async () => {
        this.setState({ open:true });
    };

    handleClose = async () => {
        this.setState({ open:false });
    };

    handleSubmit = async () => {

        const { history } = this.props
        const { newTag } = this.state;
        axios.post('/api/tags', newTag)
            .then(response => {
                swal("Done!", "Tag Created!", "success");
                this.setState({
                    loading: true,
                });
                this.handleClose();
            })
            .catch(error => {
                this.setState({
                    errors: error.response.data.errors
                });
            });
    };

    render () {

        const { 
            tags, 
            open 
        } = this.state;

        console.log(tags);
        return (
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <div className='card-header'>All Tags</div>
                    <NewTagModal open={open} handleFieldChange={this.handleFieldChange} handleSubmit={this.handleSubmit} handleClose={this.handleClose} />

                    </Grid>
                    <Grid item xs={6}>
                        <div className='card-body'>
                            <ul className='list-group list-group-flush'>
                                {tags.map(tag => (
                                    <Link
                                        className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                                        to={`/${tag.id}`}
                                        key={tag.id}
                                    >
                                        {tag.title}
                                    </Link>
                                ))}
                            </ul>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <button type="button" onClick={this.handleOpen}>
                            Create Tag
                        </button>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default TagsList;