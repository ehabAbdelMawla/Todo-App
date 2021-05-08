import Firebase from 'firebase'
import aes256 from 'aes256'
import store from '../index.js';

const getlistOf = async (user) => {
    const enckey = store.getState().encKey
    var userBranches;
    var newShape = {}
    var watchingTheHeroes = await Firebase.database().ref().child(`users/${user.uid}/branches`);
    var snapshot;
    try { snapshot = await watchingTheHeroes.once('value') }
    catch (error) {
        store.dispatch({ type: 'SET_USER', Cu_User: user, branches: 10 })
    }
    if (snapshot && snapshot.exists()) {
        userBranches = snapshot.val();
        if (userBranches || Object.keys(userBranches).length) {
            userBranches = Object.keys(userBranches).map(branchId => {
                var branchObj = userBranches[branchId]
                branchObj.doneNumber = 0;
                branchObj.openNumber = 0;
                branchObj.complementRate = 0;
                if (branchObj.hasOwnProperty("todoList")) {
                    var myList = branchObj.todoList;
                    myList = Object.keys(myList).forEach(itemId => {
                        var itemObj = myList[itemId];
                        try {
                            itemObj.content = aes256.decrypt(enckey, itemObj.content);
                        }
                        catch (error) {
                            console.log(error)
                        }

                        if (itemObj.status === "needed") {
                            branchObj.openNumber++;
                        } else {
                            branchObj.doneNumber++;
                        }
                    })
                    branchObj.complementRate = ((branchObj.doneNumber) / (branchObj.openNumber + branchObj.doneNumber)) * 100
                }
                branchObj.branchName = aes256.decrypt(enckey, branchObj.branchName);
                newShape[branchObj.id] = branchObj
            })
            store.dispatch({ type: 'SET_USER', Cu_User: user, branches: newShape })
        } else {
            store.dispatch({ type: 'SET_USER', Cu_User: user, branches: 10 })
        }

    } else {
        store.dispatch({ type: 'SET_USER', Cu_User: user, branches: 10 })
    }
}



const getLineChartData = (history) => {
    const enckey = store.getState().encKey
    if (history) {
        var finalData = {}
        var years = {}
        var keys = {}
        var days = Object.keys(history)

        days.forEach(day => {
            var date = new Date(day)
            if (years[date.getFullYear()]) {
                var obj = years[date.getFullYear()]
                obj[date.getMonth() + 1] = date.getFullYear()
                years[date.getFullYear()] = obj
            }
            else {
                var obj = {}
                obj[date.getMonth() + 1] = date.getFullYear()
                years[date.getFullYear()] = obj
            }
            var dayDetails = {}

            var currentItems = history[day].todoList
            Object.keys(currentItems).forEach(item => {

                dayDetails[currentItems[item].id] = { val: currentItems[item].status == "Done" ? 1 : 0, content: aes256.decrypt(enckey, currentItems[item].content) }

                keys[currentItems[item].id] = aes256.decrypt(enckey, currentItems[item].content)

            })
            finalData[day] = dayDetails
        });

        store.dispatch({
            type: "setLineChartData", lineChartData: {
                years: years,
                data: finalData,
                keys: keys
            }
        })
    }
}


const updateBranches = (cuUid) => {
    const enckey = store.getState().encKey
    var userBranches;
    var newShape = {}
    var watchingTheHeroes = Firebase.database().ref().child(`users/${cuUid}/branches`);
    watchingTheHeroes.once('value', function (snapshot) {
        userBranches = snapshot.val();
        if (userBranches) {
            userBranches = Object.keys(userBranches).map(branchId => {
                var branchObj = userBranches[branchId]
                branchObj.doneNumber = 0;
                branchObj.openNumber = 0;
                branchObj.complementRate = 0;
                if (branchObj.hasOwnProperty("todoList")) {
                    var myList = branchObj.todoList;

                    myList = Object.keys(myList).forEach(itemId => {
                        var itemObj = myList[itemId];

                        try {
                            itemObj.content = aes256.decrypt(enckey, itemObj.content)
                        } catch (error) {
                            console.log(error)
                        }
                        if (itemObj.status === "needed") {
                            branchObj.openNumber++;
                        } else {
                            branchObj.doneNumber++;
                        }
                    })
                    branchObj.complementRate = ((branchObj.doneNumber) / (branchObj.openNumber + branchObj.doneNumber)) * 100
                }
                branchObj.branchName = aes256.decrypt(enckey, branchObj.branchName)
                newShape[branchObj.id] = branchObj
            })
            store.dispatch({ type: 'FETCH_Branches', data: newShape })
        } else {
            store.dispatch({ type: 'FETCH_Branches', data: 10 })
        }

    });
}




export { getlistOf, getLineChartData, updateBranches }