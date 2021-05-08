import React, { Component } from 'react'
import { connect } from 'react-redux'
import logoImage from "../images/200.webp";
import darkImage from "../images/dark.gif";
import { Redirect } from 'react-router';
import Circular from "./circular";
class Loader extends Component {

    state = {
        theme: "light"
    }
    componentDidMount = () => {
        var currentTheme = localStorage.getItem("myTheme");
        if (currentTheme == "dark") {
            this.setState({ theme: "dark" })
        }
    }
    render() {
        if (this.props.user) {
            return <Redirect to = { '/branches/' + this.props.user.uid }
            />

        } else if (this.props.user === null) {
            return <Redirect to = { '/login' }
            />
        } else {
            return (
                <div className="preloadingPage" >
                    <img src = { this.state.theme == "light" ? logoImage : darkImage }
                alt = "img" />
                    <p > TODO App </p>
                    <Circular />
                </div>
            )
        }

    }
}

const mapStateToProps = (state) => {
    return {
        user: state.currentUser
    }

}


export default connect(mapStateToProps)(Loader);