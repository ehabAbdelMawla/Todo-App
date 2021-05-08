import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import $ from 'jquery'
import swal from 'sweetalert'
import Firebase from 'firebase';
import placeholderImage from '../images/icons8-user-90.png'
import ImageLoader from './imageLoader'
class Profile extends Component {

    state = {
        userEmail: '',
        resetPasswordClicked: false,
        img: '',
        eyeStatusOne: false
    }
    changeResetPasswordClicked = (e) => {
        this.setState(
            { resetPasswordClicked: !this.state.resetPasswordClicked }
        )
    }
    setImage = async (e) => {
        let file = e.target.files[0]
        if (file instanceof File && file.type.includes('image')) {
            this.setState({
                img: file
            })
            var storageRef = Firebase.storage().ref();
            var mountainsRef = storageRef.child(this.props.user.uid);
            var edit = await mountainsRef.put(file);
            var img = await mountainsRef.getDownloadURL()
            var user = this.props.user
            user.imageUrl = img
            this.props.setUser(user)

        }
        else {
            if (file) {
                swal({
                    title: 'يجب اختيار صورة',
                    text: '',
                    icon: 'warning',
                    button: 'اغلاق',
                })
            }
        }
    }
    selectImage = (e) => {
        $('input[type="file"]').click()
    }

    componentDidMount = async () => {
        this.props.showArrow()
        if (this.props.user.uid) {
            var storageRef = Firebase.storage().ref();
            var mountainsRef = storageRef.child(this.props.user.uid);
            try {
                var url = await mountainsRef.getDownloadURL()
                this.setState({ img: url })
            }
            catch (error) {
                console.log('Error ', error)
            }
            this.setState({ userEmail: this.props.user.email })
        }
    }

    changePassword = (e) => {
        this.setState({ userEmail: e.target.value })
    }
    checkEmail = (e) => {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(this.state.userEmail.trim())) {
            swal("Invalid Email", {
                icon: "error",
            })
            this.setState({
                userEmail: this.props.user.email
            })
            return;
        }
        if (e.target.value != this.props.user.email) {
            this.props.user.updateEmail(e.target.value).then(() => {

            }).catch(error => {

                swal("This Mail already in Used!", {
                    icon: "error",
                })
                this.setState({
                    userEmail: this.props.user.email
                })
            })
        }

    }
    checkMail = (e) => {
        if (e.key === "Enter") { this.checkEmail(e) }

    }
    resetPassword = (e) => {
        var pass = $('#resetPass').val()
        if (pass.trim().length == 0) {
            return
        }
        if (pass.trim().length < 8) {
            swal("Password very short the smallest length is 8", {
                icon: "error",
            })
            return;
        }
        this.props.user.updatePassword(pass).then(() => {

            $('#resetPass').val('')
            this.setState(
                { resetPasswordClicked: !this.state.resetPasswordClicked }
            )
            swal("Password Changed!", {
                icon: "success",
            })
        }).catch(error => {
            console.log(error)
            swal("Un Catched Error Occure!", {
                icon: "error",
            })
            $('#resetPass').val('')
        })

    }
    resetPasswordKeys = (e) => {
        if (e.key === "Enter") { this.resetPassword(e) }
    }
    eyeAction = () => {

        this.setState({
            eyeStatusOne: !this.state.eyeStatusOne
        })
    }

    render() {
        if (!this.props.user.uid) {
            return <Redirect to={'/'} />
        }


        return (
            <section className="profileSection wow fadeIn">
                <article>
                    <ImageLoader errorImageSrc={placeholderImage} imageSrc={this.state.img instanceof File ? URL.createObjectURL(this.state.img) : this.props.user.imageUrl} key={Math.random() * 1000} />
                    <input type="file" onChange={this.setImage} accept="image/*" style={{ display: "none" }} />
                    <i onClick={this.selectImage} className="fa fa-picture-o"></i>
                </article>
                <div>

                    <input type="text" autoComplete="off" placeholder="Your Email" value={this.state.userEmail} onKeyUp={this.checkMail} onChange={this.changePassword} onBlur={this.checkEmail} />
                    <p onClick={this.changeResetPasswordClicked}>Reset Password</p>
                    {this.state.resetPasswordClicked ? <div className="form-group">
                        <input type={this.state.eyeStatusOne ? 'text' : 'password'} placeholder="New Password" onKeyUp={this.resetPasswordKeys} className="wow fadeIn" id="resetPass" autoComplete="off" />
                        <i className={`fa ${this.state.eyeStatusOne ? 'fa-eye-slash' : 'fa-eye'} eyeIcon`} onClick={() => this.eyeAction()}></i>
                        <button className="btn btn-succ" onClick={this.resetPassword}>save</button>
                    </div>
                        :
                        ''}
                </div>
            </section >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.currentUser
    }
}
const mapPropsToDispatch = (dispatch) => {
    return {
        showArrow: () => dispatch({ type: 'CHANGE_BACKARROW_VISIBILTY', val: true }),
        setUser: (user) => dispatch({ type: "SET_USER", Cu_User: user })
    }
}

export default connect(mapStateToProps, mapPropsToDispatch)(Profile)