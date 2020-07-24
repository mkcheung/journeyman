// resources/assets/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'
    import NewTag from './NewTag'
    import TagsList from './TagsList'
    import PostsList from './PostsList'
    import NewPost from './NewPost'
    import SingleTag from './SingleTag'
    import NewCategory from './NewCategory'

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route exact path='/' component={PostsList} />
                <Route path='/post/create' component={NewPost} />
                <Route path='/tag/create' component={NewTag} />
                <Route path='/category/create' component={NewCategory} />
                <Route path='/:id' component={SingleTag} />
              </Switch>
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))