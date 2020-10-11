import React, {Component} from 'react';
import LoginContainer from './LoginContainer';
import {Link , withRouter} from "react-router-dom";
class Login extends Component {

    constructor(props) {

        super(props);
        this.state = {
            isLoggedIn: false
        };
    }

    async componentDidUpdate(prevProps, prevState) {

        if (prevState.isLoggedIn === false && this.props.isLoggedIn === true ) {
            if(this.props.userRole == 'Admin'){
                this.props.history.push('/adminDashboard');
            } else {
                this.props.history.push('/dashboard');
            }
        }
    }

    render() {

        let { handleLogin } = this.props;

        return (
            <div className="container">
                <div className="container">

                <div id="main">

                    <form id="login-form" action="" onSubmit={(event) => handleLogin(event)} method="post">

                        <h3 style={{ padding: 15 }}>Login Form</h3>

                        <input

                            style={styles.input}

                            autoComplete="off"

                            id="email-input"

                            name="email"

                            type="text"

                            className="center-block"

                            placeholder="email"

                        />

                        <input

                            style={styles.input}

                            autoComplete="off"

                           id="password-input"

                            name="password"

                            type="password"

                            className="center-block"

                            placeholder="password"

                        />

                        <button

                            type="submit"

                            style={styles.button}

                            className="landing-page-btn center-block text-center"

                            id="email-login-btn"

                            href="#facebook"

                        >

                            Login

                        </button>

                    </form>
                </div>

            </div>
            </div>
        )
    } 
}

const styles = {

    input: {

        backgroundColor: "white",

        border: "1px solid #cccccc",

        padding: 15,

        float: "left",

        clear: "right",

        width: "80%",

        margin: 15

    },

    button: {

        height: 44,

        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",

        border: "none",

        backgroundColor: "red",

        margin: 15,

        float: "left",

        clear: "both",

        width: "80%",

        color: "white",

        padding: 15

    },

    link: {

        width: "100%",

        float: "left",

        clear: "both",

        textAlign: "center"

    }

};

export default withRouter(Login)