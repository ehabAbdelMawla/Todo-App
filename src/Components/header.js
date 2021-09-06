import React, { Component } from 'react'
import waveImage from '../images/upperWave.svg'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import placeholderImage from '../images/icons8-user-90.png'
import ImageLoader from 'img-loading'
import Circular from './circular'
class Header extends Component {


    render() {
        return (
            <header>
                <div id="extend"></div>
                {!this.props.backArrowVisibilty && this.props.user ? <div className="userInfo">
                    <Link to={`/profile/${this.props.user.uid}`} className="link">{this.props.user.email.substring(0, this.props.user.email.indexOf('@'))}</Link>
                    <ImageLoader loader={ Circular} errorImageSrc={placeholderImage} imageSrc={this.props.user.imageUrl} key={Math.random() * 1000} />
                </div> : ''}

                {this.props.backArrowVisibilty ?
                    <span onClick={() => { window.history.back(); }}><i className="fa fa-arrow-left"></i></span> : ''}
                <img src={waveImage} draggable="false" alt="waveImage" />
            </header >
        )
    }
}

const mapStateToProps = (state) => {
    return {
        backArrowVisibilty: state.backArrowVisibilty,
        user: state.currentUser
    }
}
export default connect(mapStateToProps)(Header)