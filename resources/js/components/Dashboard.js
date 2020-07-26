import React, {Component} from 'react'
import Header from './Header';
import Footer from './Footer';
class Home extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      user: {}
    }
  }
// check if user is authenticated and storing authentication data as states if true
  componentWillMount() {
    let state = localStorage["appState"];
    console.log(state);
    if (state) {
      let AppState = JSON.parse(state);
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState.user });
    }
  }
// 4.1
render() {
    return (
      <div>
        <Header userData={this.state.user} userIsLoggedIn={this.state.isLoggedIn}/>
          <span>Whatever normally goes into the user dasboard page; the table below for instance</span> <br/>
          <table className="table table-striped">
            <tbody>
              <tr>
                <th scope="row ">User Id</th>
                <td>{this.user.id}</td>
              </tr>
              <tr>
                <th scope="row ">Full Name</th>
                <td>{this.user.name}</td>
              </tr>
              <tr>
                <th scope="row ">Email</th>
                <td>{this.user.email}</td>
              </tr>
            </tbody>
          </table>
        <Footer/>
      </div>
      )
    }
  }
export default Home