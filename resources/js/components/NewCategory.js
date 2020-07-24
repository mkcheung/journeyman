 // resources/assets/js/components/NewCategory.js

    import axios from 'axios'
    import React, { Component } from 'react'

    class NewCategory extends Component {
      constructor (props) {
        super(props)
        this.state = {
          title: '',
          slug: '',
          errors: []
        }
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleCreateNewCategory = this.handleCreateNewCategory.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
      }

      handleFieldChange (event) {
        this.setState({
          [event.target.title]: event.target.value,
          [event.target.slug]: event.target.value
        })
      }

      handleCreateNewCategory (event) {
        event.preventDefault()

        const { history } = this.props

        const category = {
          title: this.state.title,
          slug: this.state.slug,
          description: this.state.description
        }

        axios.post('/api/categories', category)
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

      render () {
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-6'>
                <div className='card'>
                  <div className='card-header'>Create new Category</div>
                  <div className='card-body'>
                    <form onSubmit={this.handleCreateNewCategory}>
                      <div className='form-group'>
                        <div>
                        <label htmlFor='name'>Category title</label>
                          <input
                            id='title'
                            type='text'
                            className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`}
                            title='title'
                            value={this.state.title}
                            onChange={this.handleFieldChange}
                          />
                          {this.renderErrorFor('title')}
                        </div>
                        <div>
                        <label htmlFor='name'>Category slug</label>
                          <input
                            id='slug'
                            type='text'
                            className={`form-control ${this.hasErrorFor('slug') ? 'is-invalid' : ''}`}
                            title='slug'
                            value={this.state.slug}
                            onChange={this.handleFieldChange}
                          />
                          {this.renderErrorFor('slug')}
                        </div>
                      </div>
                      <button className='btn btn-primary'>Create</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default NewCategory