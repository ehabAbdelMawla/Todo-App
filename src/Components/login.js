import React, { Component, Suspense } from 'react'
import { Link } from 'react-router-dom'
import Firebase from 'firebase'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import $ from 'jquery'
import store from '../index.js';
import PreLoad from './preLoader.js'
import aes256 from 'aes256'


class Login extends Component {
    state = {
        email: '',
        pass: '',
        eyeStatus: false,

    }
    handelEmailChange = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    handelPassChange = (e) => {
        this.setState({
            pass: e.target.value
        })
    }



    loginMethod = (e) => {
        e.preventDefault();
        if (this.state.email.trim() === '' || this.state.pass.trim() === '') {
            swal("Data Incomplete", {
                icon: "error",
            })
            return;
        }

        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!re.test(this.state.email.trim())) {
            swal("Invalid Email", {
                icon: "error",
            })
            return;
        }
        Firebase.auth().signInWithEmailAndPassword(this.state.email.trim(), this.state.pass.trim()).then(() => {
            // this.props.history.push('/branches/' + this.props.user.uid)
        }
        ).catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/user-not-found") {
                swal("You have no account ,please sign up first", {
                    icon: "error",
                })
            }
            else if (errorCode == "auth/wrong-password") {
                swal("Incorrect password", {
                    icon: "error",
                })
            }
        });
    }

    eyeAction = (e) => {
        this.setState({
            eyeStatus: !this.state.eyeStatus
        })
    }

    render() {
        if (this.props.user) {
            return <Redirect to={'/branches/' + this.props.user.uid} />
        }

        return (

            <div className="center Login wow fadeIn" ><div>
                <h1>Login</h1>
                <form onSubmit={this.loginMethod}>
                    <div className="form-group">
                        {/* <label htmlFor="inputEmail">Email address</label> */}
                        <i className="fa fa-at"></i> <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" onChange={this.handelEmailChange} autoComplete="off" required placeholder="Email" />
                    </div>
                    <div className="form-group">
                        {/* <label htmlFor="inputPass">Password</label> */}
                        <i className="fa fa-key"></i>
                        <input type={this.state.eyeStatus ? 'text' : 'password'} className="form-control" id="inputPass" onChange={this.handelPassChange} required placeholder="Password" />
                        <i className={`fa ${this.state.eyeStatus ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`} onClick={this.eyeAction}></i>
                    </div>
                    <div className="buttonContainer">
                        <button className="btn" id='signInBtn' >Login</button>
                    </div>
                </form>
                <ul>
                    {/* <li> <Link to="/" className="link">Login</Link></li> */}
                    <li> <Link to="/signUP" className="link">Sign Up...</Link></li>
                </ul>
            </div> </ div>
        )

    }
}

const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
        enckey: state.encKey
    }
}
export default connect(mapSatteToProps)(Login)