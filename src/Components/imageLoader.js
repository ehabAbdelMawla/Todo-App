import React, { Component } from 'react'
import { connect } from 'react-redux'
import Circular from './circular'
class ImageLoader extends Component {
    state = {
        error: false,
        loaded: false,
    }

    imageLoad = () => {
        this.setState({
            loaded: true
        })
    }

    errorOccure = () => {
        this.setState({
            error: true
        })
    }


    render() {
        return (
            <section className={"image-container"}>
                <img
                    draggable="false"
                    src={this.state.error ? this.props.errorImageSrc : this.props.imageSrc ? this.props.imageSrc : this.props.errorImageSrc}
                    onLoad={this.imageLoad}
                    onError={this.errorOccure}
                    loading="lazy"
                    alt="AccountImage"
                />
                {!this.state.loaded && (
                    <article className="image-container-overlay">
                        <Circular />
                    </article>
                )}
            </section>
        )


    }
}
const mapStateToProps = (state) => {
    return {

    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        showImageContaienr: (Imgsrc) => dispatch({ type: 'SHOW_IMAGE_PREVIEW', src: Imgsrc })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(ImageLoader)