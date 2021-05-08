import React, { Component } from 'react';
import Firebase from 'firebase';
import EditPopUp from './editItem'
import swal from 'sweetalert'
import { connect } from 'react-redux'
import Modal from 'react-awesome-modal';

class Task extends Component {
    myRef = React.createRef(null);
    state = {
        editVisability: false,
        animateClass: "fadeInUpImp",
        deleteNotation: false
    }

    finishToDoItem = () => {
        const { id, status, branchid, filter, toggleStatus } = this.props
        var newStatus = status === "Done" ? "needed" : "Done"
        Firebase.database().ref().child(`users/${this.props.user.uid}/branches/${this.props.branchid}/todoList/${id}`)
            .update({ status: newStatus }).then(() => {
                if (filter && filter === "All") {
                    toggleStatus(branchid, id, newStatus)
                }
                else {
                    this.myRef.current.style.animationName = ""
                    this.setState({
                        animateClass: "fadeOutDownImp",
                        deleteNotation: false
                    })
                }

            }
            )
    }


    modelVisability = (val) => {
        this.setState({
            editVisability: val
        })
    }




    deleteToDo = () => {
        swal({
            title: "Are you sure?",
            text: "This Item Will Be Remove!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    const { id, branchid } = this.props
                    Firebase.database().ref().child(`users/${this.props.user.uid}/branches/${branchid}/todoList/${id}`).remove().then(() => {
                        this.myRef.current.style.animationName = ""
                        this.setState({
                            animateClass: "fadeOutDownImp",
                            deleteNotation: true
                        })

                        swal("Poof! Item has been deleted!", {
                            icon: "success",
                        })
                    }
                    )

                }
            });

    }

    render() {
        return (
            <React.Fragment>
                {this.state.editVisability ? <Modal visible={this.state.editVisability} width="600" height="300" effect="fadeInUp" onClickAway={() => this.modelVisability(false)}>
                    <EditPopUp prevItem={this.props} branchid={this.props.branchid} onCancle={this.modelVisability} />
                </Modal> : ""}
                <div className={`todoItem ${this.props.periority} wow ${this.state.animateClass}`}
                    ref={this.myRef}
                    onAnimationEnd={({ animationName }) => {
                        const { id, branchid, status, deleteTask, toggleStatus } = this.props;
                        if (animationName === "fadeOutDown" && this.state.deleteNotation) {
                            deleteTask(branchid, id)
                        } else if (animationName === "fadeOutDown") {
                            var newStatus = status === "Done" ? "needed" : "Done"
                            toggleStatus(branchid, id, newStatus)
                        }
                    }}
                >

                    <span onDoubleClick={() => { this.finishToDoItem() }} className={this.props.status}>
                        {this.props.content}</span>
                    <div className="btns">
                        <button onClick={() => this.modelVisability(true)}><i className="fa fa-edit"></i></button>
                        <button onClick={() => { this.deleteToDo() }}><i className="fa fa-trash"></i></button>
                    </div>
                </div>
            </React.Fragment >

        );
    }
}

const mapSatteToProps = (state) => {
    return {
        user: state.currentUser,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        toggleStatus: (branchId, taskId, newStatus) => dispatch({ type: "CHANGE_STATUS", branchId, taskId, newStatus }),
        deleteTask: (branchId, taskId) => dispatch({ type: "DELETE_TASK", branchId, taskId }),
    }
}

export default connect(mapSatteToProps, mapDispatchToProps)(Task);
