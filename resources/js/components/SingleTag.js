 // resources/assets/js/components/SingleTag.js

    import axios from 'axios'
    import React, { Component } from 'react'

    class SingleTag extends Component {
      constructor (props) {
        super(props)
        this.state = {
          tags: []
        }
      }

      componentDidMount () {
        const tagId = this.props.match.params.id

        axios.get(`/api/tags/${tagId}`).then(response => {
          this.setState({
            tags: response.data.tags
          })
        })
      }

      render () {
        const { tags } = this.state

        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header'>{tag.name}</div>
                  <div className='card-body'>
                    <p>{tag.description}</p>

                    <button className='btn btn-primary btn-sm'>
                      Mark as completed
                    </button>

                    <hr />

                    <ul className='list-group mt-3'>
                      {tags.map(tag => (
                        <li
                          className='list-group-item d-flex justify-content-between align-items-center'
                          key={tag.id}
                        >
                          {tag.title}

                          <button className='btn btn-primary btn-sm'>
                            Mark as completed
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default SingleTag