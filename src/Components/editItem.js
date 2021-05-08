import React, { Component } from 'react'
import { connect } from 'react-redux'

import Firebase from 'firebase'
import aes256 from 'aes256'

class EditPopUp extends Component {

    state = {
        content: this.props.prevItem.content,
        prevId: this.props.prevItem.id,
        periority: this.props.prevItem.periority
    }

    handelSubmit = (e) => {
        e.preventDefault();
        if (this.state.content.trim() === '') {
            return
        }
        if (this.props.user.uid !== undefined) {
            Firebase.database().ref(`users/${this.props.user.uid}/branches/${this.props.branchid}/todoList/${this.state.prevId}`).update({
                content: aes256.encrypt(this.props.encKey, this.state.content),
                periority: this.state.periority
            }).then(
                this.props.editName(this.state.prevId, this.props.branchid, this.state.content, this.state.periority)
            );
            this.props.onCancle(false)
        }
    }

    render() {
        return (
            <article className="editScene">
                <form onSubmit={this.handelSubmit}>
                    <input
                        type="text"
                        value={this.state.content}
                        onChange={(e) => {
                            this.setState({
                                content: e.target.value
                            })
                        }}
                        placeholder="Task Name"
                        required
                    />
                    <select id="myListEdit" className="browser-default" value={this.state.periority} onChange={(e) => {
                        this.setState({
                            periority: e.target.value
                        })
                    }} required>
                        <option value="Low" defaultValue>Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option></select>
                    <button type="submit">Edit</button>
                    <button type="button" onClick={() => this.props.onCancle(false)}>Cancle</button>
                </form>
            </article>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.currentUser,
        encKey: state.encKey
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        editName: (taskId, branchId, newName, newPeriority) => dispatch({ type: "EDIT_TASK", taskId, branchId, newName, newPeriority })
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(EditPopUp)