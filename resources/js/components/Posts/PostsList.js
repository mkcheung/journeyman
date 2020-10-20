  // resources/assets/js/components/postsList.js

    import axios from 'axios';
    import React, { Component } from 'react';
    import { Link } from 'react-router-dom';
    import { withRouter } from "react-router";

    class PostsList extends Component {
      constructor () {
        super()
        this.state = {
          posts: []
        }
      }

      componentDidMount () {
        axios.get('/api/posts').then(response => {
          this.setState({
            posts: response.data
          })
        })
      }

      render () {
        const { posts } = this.state
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header'>All Posts</div>
                  <div className='card-body'>
                    <Link className='btn btn-primary btn-sm mb-3' to='/post/create'>
                      Create new post
                    </Link>
                    <br/>
                    <Link className='btn btn-primary btn-sm mb-3' to='/category/create'>
                      Create new category
                    </Link>
                    <br/>
                    <Link className='btn btn-primary btn-sm mb-3' to='/tag/create'>
                      Create new tag
                    </Link>
                    <br/>
                    <ul className='list-group list-group-flush'>
                      {posts.map(post => (
                        <Link
                          className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                          to={`/${post.id}`}
                          key={post.id}
                        >
                          {post.name}
                          <span className='badge badge-primary badge-pill'>
                            {post.tasks_count}
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

    export default withRouter(PostsList)