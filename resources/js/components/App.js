// resources/assets/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'
    import NewTag from './NewTag'
    import TagsList from './TagsList'
    import SingleTag from './SingleTag'

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route exact path='/' component={TagsList} />
                <Route path='/create' component={NewTag} />
                <Route path='/:id' component={SingleTag} />
              </Switch>
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))