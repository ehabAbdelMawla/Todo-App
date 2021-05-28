import React, { Component } from 'react'
import Firebase from 'firebase';
import { connect } from 'react-redux'
import { Link,Redirect } from 'react-router-dom'
import swal from 'sweetalert';

class SignUp extends Component {
    state = {
        email: '',
        pass: '',
        confirmPass: '',
        eyeStatusOne: false,
        eyeStatusTwo: false,
        submitBtnDisable:false
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
    handelConfpassChange = (e) => {
        this.setState({
            confirmPass: e.target.value
        })
    }

    signupMethod = (e) => {
        e.preventDefault();
        this.setState({
            submitBtnDisable: true
        }, async() => {
             if (this.state.email.trim() === '' || this.state.pass.trim() === '' || this.state.confirmPass.trim() === '') {
            swal("Data Incomplete", {
                icon: "error",
            })
            return;
        }

        if (this.state.pass.trim() !== this.state.confirmPass.trim()) {
            swal("passwords mismatch", {
                icon: "error",
            })
            return;
        }
        if (this.state.pass.trim().length < 8 || this.state.confirmPass.trim().length < 8) {
            swal("Password very short the smallest length is 8", {
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
            try {
                 await Firebase.auth().createUserWithEmailAndPassword(this.state.email.trim(), this.state.pass.trim());
                  this.props.history.push('/branches/' + this.props.user.uid)
            }
            catch (err) {
                   var errorCode = err.code;
           
            if (errorCode === "auth/email-already-in-use") {
                    swal("Email Is Already In Use", {
                icon: "error",
            })
            }
            }
               this.setState({
                    submitBtnDisable: false 
                    })

       
        })
       
    }
    eyeAction = (num) => {
        if (num == 1) {
            this.setState({
                eyeStatusOne: !this.state.eyeStatusOne
            })
        }
        else {
            this.setState({
                eyeStatusTwo: !this.state.eyeStatusTwo
            })
        }
    }

    render() {
        if (this.props.user && this.props.user.uid) {
            return <Redirect to={'/branches/' + this.props.user.uid} />
        }
        return (
            <div className="center signup wow fadeIn"><div> <h1>Sign Up</h1>
                <form onSubmit={this.signupMethod}>
                    <div className="form-group">
                        <i className="fa fa-at"></i>   <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" onChange={this.handelEmailChange} required autoComplete="off" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <i className="fa fa-key"></i>   <input type={this.state.eyeStatusOne ? 'text' : 'password'} className="form-control" id="inputPass" onChange={this.handelPassChange} required placeholder="Password" />
                        <i className={`fa ${this.state.eyeStatusOne ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`} onClick={() => this.eyeAction(1)}></i>
                    </div>
                    <div className="form-group">
                        <i className="fa fa-key"></i>   <input type={this.state.eyeStatusTwo ? 'text' : 'password'} className="form-control" id="inputPass2" onChange={this.handelConfpassChange} required placeholder="Confirm Password" />
                        <i className={`fa ${this.state.eyeStatusTwo ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`} onClick={() => this.eyeAction(2)}></i>
                    </div>
                    <div className="buttonContainer">
                        <button className="btn btn-primary" id='signInBtn' disabled={this.state.submitBtnDisable }>Sign Up </button>
                    </div>
                </form>
                <ul>
                    <li> <Link to="/" className="link">Login...</Link></li>
                </ul></div> </div>
        )

    }
}



const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
    }
}

export default connect(mapSatteToProps)(SignUp)