import axios from 'axios'
import React, { Component } from 'react'
import swal from 'sweetalert';
import { render } from 'react-dom';
// import { AgGridColumn, AgGridReact } from 'ag-grid-react';

// var gridOptions = {
//     columnDefs: [
//         { headerName: 'Make', field: 'make' },
//         { headerName: 'Model', field: 'model' },
//         { headerName: 'Price', field: 'price' }
//     ],
//     rowData: [
//         { make: 'Toyota', model: 'Celica', price: 35000 },
//         { make: 'Ford', model: 'Mondeo', price: 32000 },
//         { make: 'Porsche', model: 'Boxter', price: 72000 }
//     ]
// };

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

    async handleCreateNewTag (event) {
        event.preventDefault()

        const { 
          history 
        } = this.props

        const { 
          description,
          title,
          token 
        } = this.state;

        const tag = {
          title: title,
          description: description
        }

        await axios.post('/api/tags',
            {
                data: tag,

            },
            {   
                headers: {
                    'Authorization': 'Bearer '+token,
                    'Accept': 'application/json'
                }
            }
        )
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
    
    const { 
      description,
      title 
    } = this.state;

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
                      value={title}
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