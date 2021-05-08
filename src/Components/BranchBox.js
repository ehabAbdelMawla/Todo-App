import React, { useState, useRef } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import swal from 'sweetalert';
import Firebase from 'firebase';
import { useSelector, useDispatch } from 'react-redux'
import aes256 from 'aes256'
import App from './App'

export default function BranchBox({ id, complementRate, branchName, history }) {

    /**
     * Data Fields
     */
    const referance = useRef(null);
    const [animateClass, setanimateClass] = useState("fadeInUpImp");
    const user = useSelector(state => state.currentUser)
    const dispatch = useDispatch();
    /**
     * Contreoles 
     */
    const openToDoOfbranch = () => {
        history.push(`/todoList/${id}`)
    }


    const deleteBranch = () => {
        const isDefaultBranch = id != 1399;
        if (isDefaultBranch) {
            /**
             * COnfirmation Alert
             */
            swal({
                    title: "Are you sure?",
                    text: "All Data inside This Branch will be deleted Too!",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {

                        Firebase.database().ref().child(`users/${user.uid}/branches/${id}`).remove().then(() => {
                            referance.current.style.animationName = ""
                            setanimateClass("fadeOutDownImp")
                                /**
                                 * Resulting Alert
                                 */
                            swal("Poof! branch has been deleted!", {
                                icon: "success",
                            })
                        })
                    }
                });
        } else {
            swal({
                title: "Not allowed for you to delete the basic branch!",
                icon: "warning",
                dangerMode: true,
            })
        }
    }

    const updateBranch = () => {
        swal("Write New Name:", {
                content: "input",
            })
            .then((value) => {
                if (value != null && value.trim() != "") {
                    Firebase.database().ref().child(`users/${user.uid}/branches/${id}`).update({ 'branchName': aes256.encrypt(process.env.REACT_APP_ENC_KEY, value) }).then(() => {
                        dispatch({ type: "UPDATE_BRANCH_NAME", id, value })
                        swal("Branch Updated Successfully!", {
                            icon: "success",
                        })
                    });
                }
            })
    }

    return ( <
        div className = { `branchCard wow  ${animateClass}` }
        ref = { referance }
        onAnimationEnd = {
            ({ animationName }) => {
                if (animationName === "fadeOutDown") { dispatch({ type: "REMOVE_BRANCH", id }) }
            }
        } >
        <
        div className = "head" >
        <
        button type = "button"
        onClick = { updateBranch } >
        <
        i className = "fa fa-edit" > < /i></button >
        <
        button type = "button"
        onClick = { deleteBranch } >
        <
        i className = "fa fa-trash" > < /i> < /
        button > <
        /div> <
        div className = "contextBody"
        onClick = { openToDoOfbranch } >
        <
        CircularProgressbar value = { complementRate ? complementRate : 0 }
        maxValue = { 100 }
        text = { `${complementRate ? complementRate.toPrecision(3) : 0}%` }
        className = { complementRate >= 25 ? complementRate >= 50 ? complementRate >= 75 ? "done" : "succ" : "warn" : "dang" }
        /> <
        p className = "wow text-focus-in" > { branchName } < /p> < /
        div > <
        /div>
    )
}