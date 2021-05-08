import React, { Component } from 'react'
import Firebase from 'firebase';
import { connect } from 'react-redux'
import LineChart from './lineChart'
import aes256 from 'aes256'
import TasksList from './TasksList';
class AddToDO extends Component {

    state = {
        content: '',
        periority: 'Low',
    }


    handelChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }


    handelSubmit = (e) => {
        e.preventDefault();
        if (this.state.content.trim() === '') {
            alert('You Must Fill The Input')
            return
        }
        else if (this.state.content.trim().startsWith("pattern")) {
            let [pattern, start, end] = this.state.content.trim().replace("pattern", "").replace(/[\(\)]/g, "").split(",");
            pattern = pattern.replaceAll(/\"/g, "") + " "
            if (pattern && start && end && end >= start) {
                for (let i = start; i <= end; i++) {
                    this.addToDoItem(pattern + i)
                }
            }
        }
        else {
            this.addToDoItem(this.state.content.trim())
        }
        this.setState({
            content: '',
            periority: "Low"
        })
    }
    addToDoItem = (content) => {
        if (this.props.user.uid !== undefined) {
            var todo = {
                id: new Date().getTime(),
                content: aes256.encrypt(this.props.enckey, content),
                periority: this.state.periority,
                status: 'needed'
            }
            Firebase.database().ref(`users/${this.props.user.uid}/branches/${this.props.branchid}/todoList/${todo.id}`).set(todo).then(
                this.props.addNewItem({ ...todo, content: content.trim() }, this.props.branchid)
            );
        }
    }

    render() {
        const { branches, branchid } = this.props
        const toDoListElemnts = <TasksList branchid={branchid} />
        const content = this.props.user.uid === undefined ? (
            <p>You Must Login First</p>
        ) :
            (<div>

                <form onSubmit={this.handelSubmit} className="addForm wow wobble">
                    <input type="text" onChange={this.handelChange} value={this.state.content} required placeholder="New Task Name...." />

                    <select id="myList"
                        className="browser-default"
                        value={this.state.periority}
                        onChange={(e) => {
                            this.setState({
                                periority: e.target.value
                            })
                        }}
                        required>
                        <option value="Low" defaultValue>Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>

                    </select>
                    <button type="submit" className='btn'>Add</button>
                </form>

                <div className="tasksContainer">
                    {toDoListElemnts}
                    {branchid === "1399" ? <div className="Statistics"><LineChart /> </div> : ''}
                </div>

            </div>
            );

        return (
            <div className="addFormContainer wow fadeIn">
                {content}
            </div>
        );
    }
}

const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
        branches: state.branches,
        enckey: state.encKey
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

        addNewItem: (dataObj, branchId) => dispatch({ type: "ADD_NEW_ITEM", dataObj, branchId })
    }
}

export default connect(mapSatteToProps, mapDispatchToProps)(AddToDO)