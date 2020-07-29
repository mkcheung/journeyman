 // resources/assets/js/components/NewPost.js

    import axios from 'axios'
    import React, { Component } from 'react'
    import { Editor } from '@tinymce/tinymce-react';
    import { 
      Checkbox,
      FormControl,
      FormControlLabel,
      FormLabel,
      InputLabel,
      Select,
      TextareaAutosize
    } from '@material-ui/core';

    class NewPost extends Component {
      constructor (props) {
        super(props)
        this.state = {
          title: '',
          tag:'',
          slug:'',
          category_id:'',
          publish:false,
          content:'',
          categories:[],
          tags:[],
          errors: []
        }
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleCreateNewPost = this.handleCreateNewPost.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
      }

      componentDidMount () {
        axios.get('/api/tags').then(res => {

          let tagOptions = [];
          let tags = res.data;

          tags.forEach(function(tag){
            let temp = []
            temp['id'] = tag.id;
            temp['value'] = tag.title;
            tagOptions.push(temp);
          });
   
          this.setState( {
            tags: tagOptions
          });
        })
        .catch(error => {
          return error;
        });

        axios.get('/api/categories').then(res => {

          let categoryOptions = [];
          let categories = res.data;

          categories.forEach(function(category){
            let temp = []
            temp['id'] = category.id;
            temp['value'] = category.title;
            categoryOptions.push(temp);
          });
   
          this.setState( {
            categories: categoryOptions
          });
        })
        .catch(error => {
          return error;
        });
      }

      handleFieldChange (event) {
        this.setState({
          [event.target.title]: event.target.value,
          [event.target.slug]: event.target.value,
          [event.target.content]: event.target.value,
          [event.target.category_id]: event.target.value
        })
      }

      handleCreateNewPost (event) {
        event.preventDefault()

        const { history } = this.props

        const post = {
          title: this.state.title,
          slug: this.state.slug,
          publish: this.state.publish,
          content: this.state.content,
          category_id: this.state.category_id
        }

        axios.post('/api/posts', post)
          .then(response => {
            // redirect to the homepage
            history.push('/')
          })
          .catch(error => {
            this.setState({
              errors: error.response.data.errors
            })
          })
      }

      hasErrorFor (field) {
        return !!this.state.errors[field]
      }

      renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
          return (
            <span className='invalid-feedback'>
              <strong>{this.state.errors[field][0]}</strong>
            </span>
          )
        }
      }

      handleChange = (event) => {
        this.setState({
          ...this.state,
          [event.target.name]: event.target.value,
        });
      };

      handleChkboxToggle = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.checked
        });
      };

      handleEditorChange = (content, editor) => {
       console.log('Content was updated:', content);
        this.setState({
          ...this.state,
          ['content']: content,
        });
      }

      render () {
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-6'>
                <div className='card'>
                  <div className='card-header'>Create New Post</div>
                  <div className='card-body'>
                    <form onSubmit={this.handleCreateNewPost}>
                      <div className='form-group'>
                        <div>
                        <label htmlFor='name'>Post title</label>
                        <input
                          id='title'
                          type='text'
                          classtitle={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`}
                          title='title'
                          value={this.state.title}
                          onChange={this.handleFieldChange}
                        />
                        {this.renderErrorFor('title')}
                        </div>
                        <div>
                        <label htmlFor='name'>Post slug</label>
                        <input
                          id='slug'
                          type='text'
                          classslug={`form-control ${this.hasErrorFor('slug') ? 'is-invalid' : ''}`}
                          title='slug'
                          value={this.state.slug}
                          onChange={this.handleFieldChange}
                        />
                        {this.renderErrorFor('slug')}
                        </div>
                        <div>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.publish}
                                        onChange={this.handleChkboxToggle}
                                        name="publish"
                                        color="primary"
                                    />
                                }
                                label="Publish"
                            />
                        </div>
                        <div>
                          <FormControl >
                            <InputLabel htmlFor="age-native-simple">Tags</InputLabel>
                            <Select
                              native
                              value={this.state.tag}
                              onChange={this.handleChange}
                              inputProps={{
                                name: 'age',
                                id: 'age-native-simple',
                              }}
                            >
                            <option value='0'></option>
                            {
                              Object
                              .keys(this.state.tags)
                              .map(key => <option key={key} value = {this.state.tags[key].id}>{this.state.tags[key].value}</option>)
                            }
                            </Select>
                          </FormControl>
                        </div>
                        <div>
                          <FormControl >
                            <InputLabel htmlFor="age-native-simple">Category</InputLabel>
                            <Select
                              native
                              value={this.state.category_id}
                              onChange={this.handleChange}
                              title='category_id'
                              inputProps={{
                                name: 'age',
                                id: 'age-native-simple',
                              }}
                            >
                            <option value='0'></option>
                            {
                              Object
                              .keys(this.state.categories)
                              .map(key => <option key={key} value = {this.state.categories[key].id}>{this.state.categories[key].value}</option>)
                            }
                            </Select>
                          </FormControl>
                        </div>
                        <div>
                        <label htmlFor='name'>Content</label>
                        <Editor
                           initialValue="<p>This is the initial content of the editor</p>"
                           title='content'
                           init={{
                             height: 500,
                             menubar: false,
                             plugins: [
                               'advlist autolink lists link image charmap print preview anchor',
                               'searchreplace visualblocks code fullscreen',
                               'insertdatetime media table paste code help wordcount'
                             ],
                             toolbar:
                               'undo redo | formatselect | bold italic backcolor | \
                               alignleft aligncenter alignright alignjustify | \
                               bullist numlist outdent indent | removeformat | help'
                           }}
                           onEditorChange={this.handleEditorChange}
                         />
                        {this.renderErrorFor('content')}
                        </div>
                        <button className='btn btn-primary'>Create</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default NewPost