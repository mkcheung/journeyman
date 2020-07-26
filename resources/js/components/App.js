// resources/assets/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Link, Route, Switch } from 'react-router-dom'
    import Main from './Router';

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <Route component={Main} />
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))