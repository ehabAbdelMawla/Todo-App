import Firebase from 'firebase';

let initState = {
    currentUser: undefined,
    encKey: process.env.REACT_APP_ENC_KEY,
    branches: [],
    backArrowVisibilty: false,
    lineChartData: {}
};




const rootReducer = (state = initState, action) => {
    if (action.type === 'SET_USER') {
        return {
            ...state,
            currentUser: action.Cu_User,
            branches: action.branches ? action.branches : state.branches,
        }
    } else if (action.type === 'FETCH_Branches') {

        return {
            ...state,
            branches: action.data
        }
    } else if (action.type === "ADD_NEW_BRANCH") {
        const newBranches = {...state.branches };
        newBranches[action.data.id] = action.data;
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "REMOVE_BRANCH") {
        const newBranches = {...state.branches };
        delete newBranches[action.id];
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "UPDATE_BRANCH_NAME") {
        const newBranches = {...state.branches };
        newBranches[action.id].branchName = action.value;
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "ADD_NEW_ITEM") {
        const targetBranch = state.branches[action.branchId]
        const { id } = targetBranch;
        if (!targetBranch.todoList || targetBranch.todoList === true) {
            targetBranch.todoList = {}
        }
        targetBranch.todoList[action.dataObj.id] = action.dataObj
        targetBranch.openNumber += 1
        targetBranch.complementRate = ((targetBranch.doneNumber) / (targetBranch.openNumber + targetBranch.doneNumber)) * 100
        const newBranches = {...state.branches }
        newBranches[id] = targetBranch
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "CHANGE_STATUS") {
        const targetBranch = state.branches[action.branchId]
        const targetTask = targetBranch.todoList[action.taskId]
        const { id } = targetBranch;
        targetTask.status = action.newStatus
        if (action.newStatus === "Done") {
            targetBranch.doneNumber += 1
            targetBranch.openNumber -= 1
        } else {
            targetBranch.doneNumber -= 1
            targetBranch.openNumber += 1
        }

        targetBranch.complementRate = ((targetBranch.doneNumber) / (targetBranch.openNumber + targetBranch.doneNumber)) * 100
        const newBranches = {...state.branches }
        newBranches[id] = targetBranch
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "EDIT_TASK") {
        const targetBranch = state.branches[action.branchId]
        const targetTask = targetBranch.todoList[action.taskId]
        const { id } = targetBranch;
        console.log(targetTask)
        targetTask.content = action.newName
        targetTask.periority = action.newPeriority
        const newBranches = {...state.branches }
        newBranches[id] = targetBranch
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "DELETE_TASK") {
        const targetBranch = state.branches[action.branchId]
        const { id } = targetBranch;

        const targetTask = targetBranch.todoList[action.taskId]
        if (targetTask.status == "Done") {
            targetBranch.doneNumber -= 1
        } else {
            targetBranch.openNumber -= 1
        }
        targetBranch.complementRate = ((targetBranch.doneNumber) / (targetBranch.openNumber + targetBranch.doneNumber)) * 100
        delete targetBranch.todoList[action.taskId]
        const newBranches = {...state.branches }
        newBranches[id] = targetBranch
        return {
            ...state,
            branches: newBranches
        }
    } else if (action.type === "CHANGE_BACKARROW_VISIBILTY") {
        return {
            ...state,
            backArrowVisibilty: action.val
        }
    } else if (action.type === "setLineChartData") {
        return {
            ...state,
            lineChartData: action.lineChartData
        }
    }


    return state;
}

export default rootReducer