  // resources/assets/js/components/TagsList.js

    import axios from 'axios'
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom'

    class TagsList extends Component {
      constructor () {
        super()
        this.state = {
          tags: []
        }
      }

      componentDidMount () {
        axios.get('/api/tags').then(response => {
          this.setState({
            tags: response.data
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
                  <div className='card-header'>All tags</div>
                  <div className='card-body'>
                    <Link className='btn btn-primary btn-sm mb-3' to='/create'>
                      Create new tag
                    </Link>
                    <ul className='list-group list-group-flush'>
                      {tags.map(tag => (
                        <Link
                          className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                          to={`/${tag.id}`}
                          key={tag.id}
                        >
                          {tag.name}
                          <span className='badge badge-primary badge-pill'>
                            {tag.tasks_count}
                          </span>
                        </Link>
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

    export default TagsList