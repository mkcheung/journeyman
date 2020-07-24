 // resources/assets/js/components/Newtag.js

    import axios from 'axios'
    import React, { Component } from 'react'
    import swal from 'sweetalert';

    class NewTag extends Component {
      constructor (props) {
        super(props)
        this.state = {
          title: '',
          errors: []
        }
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleCreateNewTag = this.handleCreateNewTag.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
      }

      handleFieldChange (event) {
        this.setState({
          [event.target.title]: event.target.value
        })
      }

      handleCreateNewTag (event) {
        event.preventDefault()

        const { history } = this.props

        const tag = {
          title: this.state.title,
          description: this.state.description
        }

        axios.post('/api/tags', tag)
          .then(response => {
            // redirect to the homepage
            swal("Done!", "Tag Created!", "success");
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

      render () {
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-6'>
                <div className='card'>
                  <div className='card-header'>Create new Tag</div>
                  <div className='card-body'>
                    <form onSubmit={this.handleCreateNewTag}>
                      <div className='form-group'>
                        <label htmlFor='name'>Tag title</label>
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
                      <button 
                        className='btn btn-primary'
                        onClick={this.handleCreateNewTag}>
                        Create
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default NewTag