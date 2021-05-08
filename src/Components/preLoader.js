import React, { Component } from 'react'
import Circular from './circular'
import login from './login'

class PreLoad extends Component {

    state = {
        loaded: false,
        content: null
    }

    componentWillReceiveProps = async (newProps) => {
        var content = await newProps.fakeRender()
        this.setState({ content: content, loaded: true, })
    }
    componentDidMount = async () => {
        var content = await this.props.fakeRender()
        this.setState({ content: content, loaded: true, })

    }


    render() {
        console.log('preload Render', this.state)
        return (
            <div> {this.state.loaded && this.state.content ? this.state.content : <Circular />}</ div>
        )
    }
}

export default PreLoad