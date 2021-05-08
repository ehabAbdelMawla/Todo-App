import React, { Component } from 'react'
import waveImage from './images/wave.svg'
class Footer extends Component {
    render() {
        return (
            <footer>
                <img
                    src={waveImage}
                    alt="Wav header" />
            </footer>
        )
    }
}

export default Footer