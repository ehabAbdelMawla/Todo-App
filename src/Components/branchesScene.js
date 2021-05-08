import React, { Component, PureComponent } from 'react'
import { connect } from 'react-redux'
import Firebase from 'firebase';
import store from '../index'
import { Redirect } from 'react-router-dom'
import swal from 'sweetalert';
import { Link } from 'react-router-dom'
import $ from 'jquery'
import Login from './login'
import Circular from './circular'
import aes256 from 'aes256'
import App from './App'
import BranchBox from './BranchBox';


class Branches extends PureComponent {


    state = {
        branchName: '',
        cuTheme: localStorage.getItem('myTheme'),
    }


    logout = (id) => {
        Firebase.auth().signOut();
        this.props.resetUser();

    }


    changeBranchName = (e) => {
        this.setState({
            branchName: e.target.value
        })
    }

    addNewBranch = (e) => {
        e.preventDefault()
        var branchId = new Date().getTime();
        let newBranch = { branchName: aes256.encrypt(this.props.enckey, this.state.branchName), id: branchId, todoList: true }
        Firebase.database().ref(`users/${this.props.user.uid}/branches/${branchId}`).set(newBranch).then(
            this.props.add_new_branch({ branchName: this.state.branchName, id: branchId, todoList: true })
        );
        this.setState({
            branchName: ''
        })
    }


    toggleTheme = () => {
        var currentTheme = localStorage.getItem('myTheme');
        if (currentTheme == "light") {
            localStorage.setItem('myTheme', 'dark');
            this.setState({
                cuTheme: "dark"
            })
            $('head').append(`<link rel="stylesheet" href="static/dark.css">`)
        } else {
            localStorage.setItem('myTheme', 'light');
            this.setState({
                cuTheme: "light"
            })
            $('head link[href="static/dark.css"]').remove()
        }
    }

    static loadingFlag = false;

    loadBranches = () => {
        return Object.keys(this.props.userBranches).map(branchId => {
            return (
                <BranchBox key={branchId} {...this.props.userBranches[branchId]} history={this.props.history} />
            )
        });

    }

    static getDerivedStateFromProps = (props, state) => {
        props.hide()
        return state
    }


    render() {
        if (!this.props.user) {
            return <Redirect to={'/'}
            />
        }
        var myForm = (<form onSubmit={this.addNewBranch}
            className="wow fadeIn" >
            <input type="text"
                placeholder="Branch Name..."
                required value={this.state.branchName}
                onChange={this.changeBranchName}
            /> <button className='btn' > < i className="fa fa-plus" > </i> </button >
        </form>)

        if (this.props.user.uid === undefined) {
            return (<ul className="Error-ul" >
                <li > < Link to="/login"
                    className="link" > Login </Link></li >
                <li > < Link to="/signUP"
                    className="link" > SignUp </Link></li >
                <p className="NonLoginMessage" > You Must Login First </p> </ul>
            )
        } else {
            if (this.props.userBranches && Object.keys(this.props.userBranches).length) {
                return (
                    <article className="BranchesPage" >
                        <div> <div className="logContainer" > <span className="logoutBtn"
                            onClick={this.logout} > < i className="fa fa-sign-out" > </i></span > </div>

                            <div className="logContainer second" > <span className="logoutBtn"
                                onClick={this.toggleTheme} > < i className={`fa fa-${this.state.cuTheme == "light" ? 'moon-o' : 'sun-o'} `} > </i></span > </div>
                            {myForm}
                            <p className="tit wow fadeInDown" >
                                My Branches </p>
                            <section className="branchParent " >
                                {this.loadBranches()}
                            </section> </div > </article>
                )

            } else if (this.props.userBranches == 10) {
                return (
                    <article className="BranchesPage wow fadeIn" >
                        <div className="logContainer" > < span className="logoutBtn"
                            onClick={this.logout} > < i className="fa fa-sign-out" > </i></span > </div>

                        {myForm}
                        <p className="tit wow fadeInDown" >
                            No Branches Added Yet... </p>
                    </article>
                )
            } else {
                return (

                    <article className="BranchesPage wow fadeIn" >
                        <div className="logContainer" > <span className="logoutBtn"
                            onClick={this.logout} > < i className="fa fa-sign-out" > </i></span > </div>
                        {myForm} 
                        <Circular />
                    </article>
                )

            }

        }


    }


}
const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
        userBranches: state.branches,
        enckey: state.encKey
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        resetUser: () => dispatch({ type: "SET_USER", Cu_User: null }),
        add_new_branch: (obj) => dispatch({ type: "ADD_NEW_BRANCH", data: obj }),
        hide: () => dispatch({ type: 'CHANGE_BACKARROW_VISIBILTY', val: false }),
    }
}

export default connect(mapSatteToProps, mapDispatchToProps)(Branches);