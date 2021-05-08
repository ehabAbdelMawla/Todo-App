import React, { Component } from 'react'
import { connect } from 'react-redux'
import AddToDO from './addFrom'
import Firebase from 'firebase'
import { Link } from 'react-router-dom'
// import M from 'materialize-css';
import { Redirect } from 'react-router-dom'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import $ from 'jquery'
import PreLoad from './preLoader'
class Todos extends Component {

    componentDidMount = () => {
        // M.Sidenav.init(this.sidenav);
        $('html, body').animate({ scrollTop: '0px' }, 0);
        this.props.showArrow()
    }
    state = {
        filerWith: 'needed',
    }
    logout = (id) => {
        Firebase.auth().signOut()
        this.props.history.push('/')
    }



    render() {
        if (!this.props.user) {
            return <Redirect to={'/'} />
        }
        const { branches } = this.props

        const conent = this.props.user.uid === undefined ? (
            <ul className="Error-ul">
                <li> <Link to="/" className="link">Login</Link></li>
                <li> <Link to="/signUP" className="link">SignUp</Link></li>
                <p className="NonLoginMessage">You Must Login First</p>
            </ul>
        ) : (
            <div >
                <div className="cardsContainer ">
                    <h1 className="wow fadeInDown">{branches[this.props.match.params.branchName].branchName}</h1>
                    <div className="card wow bounce">
                        <CircularProgressbar value={branches[this.props.match.params.branchName].complementRate ? branches[this.props.match.params.branchName].complementRate : 0} maxValue={100} text={`${branches[this.props.match.params.branchName].complementRate ? branches[this.props.match.params.branchName].complementRate.toPrecision(3) : 0}%`} className={branches[this.props.match.params.branchName].complementRate >= 25 ? branches[this.props.match.params.branchName].complementRate >= 50 ? branches[this.props.match.params.branchName].complementRate >= 75 ? "done" : "succ" : "warn" : "dang"} />
                    </div >
                    <div className="card wow fadeInUp"><p ><i className="fa fa-thumbs-up"></i>{branches[this.props.match.params.branchName].doneNumber ? branches[this.props.match.params.branchName].doneNumber : 0}</p></div>
                    <div className="card wow fadeInUp">  <p ><i className="fa fa-exclamation-circle"></i>{branches[this.props.match.params.branchName].openNumber ? branches[this.props.match.params.branchName].openNumber : 0}</p></div>

                </div><AddToDO branchid={this.props.match.params.branchName} /></div>
        );

        return (
            <div className="todos wow fadeIn">
                {conent}
            </div>
        );

    }
}
const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
        branches: state.branches,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        show: () => dispatch({ type: 'SHOW' }),
        hide: () => dispatch({ type: 'HIDE' }),
        showArrow: () => dispatch({ type: 'CHANGE_BACKARROW_VISIBILTY', val: true }),
    }
}

export default connect(mapSatteToProps, mapDispatchToProps)(Todos)