import React, { Component } from 'react'
import Task from './task';
import { connect } from 'react-redux'
class TasksList extends Component {
    state = {
        filerWith: 'needed',

    }



    changeFilter = (text) => {
        this.setState({
            filerWith: text
        })
    }


    render() {
        const { branches, branchid } = this.props


        return (
            <React.Fragment>
                <div className="filters wow fadeInUp">
                    <button type="button" className={"btn " + (this.state.filerWith === "needed" ? "Active" : "")} onClick={() => this.changeFilter('needed')} >Open</button>
                    <button type="button" className={"btn " + (this.state.filerWith === "Done" ? "Active" : "")} onClick={() => this.changeFilter('Done')}>Done</button>
                    <button type="button" className={"btn " + (this.state.filerWith === "All" ? "Active" : "")} onClick={() => this.changeFilter('All')}>All</button>

                </div>
                {
                    branches && branches !== {} && branches[branchid] && branches[branchid].todoList && Object.keys(branches[branchid].todoList).length > 0 ? (
                        Object.keys(branches[branchid].todoList).map(tdo => {
                            var todoItem = branches[branchid].todoList[tdo]
                            if (todoItem.status === this.state.filerWith || this.state.filerWith === "All") {
                                return (<Task {...todoItem} branchid={branchid} key={todoItem.id} filter={this.state.filerWith} />);
                            }
                        })
                    ) : (
                        <p className="center">You Have No Todos left </p>
                    )
                }
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    branches: state.branches
})



export default connect(mapStateToProps)(TasksList)
