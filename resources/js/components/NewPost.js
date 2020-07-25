 // resources/assets/js/components/NewPost.js

    import axios from 'axios'
    import React, { Component } from 'react'
    import { 
      FormControl,
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
        })
      }

      handleFieldChange (event) {
        this.setState({
          [event.target.title]: event.target.value
        })
      }

      handleCreateNewPost (event) {
        event.preventDefault()

        const { history } = this.props

        const post = {
          title: this.state.title,
          description: this.state.description
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
        const name = event.target.name;
        setState({
          ...state,
          [tag]: event.target.value,
        });
      };

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
                          <FormControl >
                            <InputLabel htmlFor="age-native-simple">Tags</InputLabel>
                            <Select
                              native
                              value={this.state.age}
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
                        <label htmlFor='name'>Content</label>
                        <TextareaAutosize
                          id='content'
                          rowsMax={15}
                          aria-label="maximum height"
                          placeholder="Maximum 15 rows"
                          defaultValue="Thoughts...."
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