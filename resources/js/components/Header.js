// resources/assets/js/components/Header.js

import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom';
import { 
    Button,
    IconButton,
    Menu,
    MenuItem
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import HeaderMenu  from './HeaderMenu';

class Header extends Component {
  constructor(props) {
    super(props);
      this.state = {
        user: props.userData,
        isLoggedIn: props.userIsLoggedIn
      };
      this.logOut = this.logOut.bind(this);
  }

  logOut() {
    let appState = {
      isLoggedIn: false,
      user: {}
    };
    localStorage["appState"] = JSON.stringify(appState);
    this.setState(appState);
    this.props.history.push('/login');
  }

    render() {
        const aStyle = {
          cursor: 'pointer'
        };
    
        return (
            <nav className="navbar">
                <HeaderMenu loggedIn={this.state.isLoggedIn} logOut={this.logOut}/>
            </nav>
        );
    }
}
export default withRouter(Header)