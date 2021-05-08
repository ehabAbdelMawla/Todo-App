import React, { Component } from "react";
import {
  HashRouter as BrowserRouter,
  Route,
  withRouter,
} from "react-router-dom";
import "../Styles/custome/light.scss";

import Todos from "./todos";
import Loader from './loader'
import aes256 from "aes256";
import { connect } from "react-redux";
import SignUp from "./signUp";
import Branches from "./branchesScene";
import $ from "jquery";
import store from "../index.js";
import Firebase from "firebase";
import Header from "./header";
import Login from "./login";
import Profile from "./profile";
import { getlistOf, getLineChartData } from './helperMethods'
// import "../Styles/custome/dark.scss";                      /* To apply Dark Theme in Dev Mode */

// ..... web Dependesies .....
import niceScroll from "jquery.nicescroll";

// ..... desktop Dependesies .....
// import TitleBar from "./electronTitleBar/titleBar";
// import TitleBar from "custom-react-electron-titlebar";
// ........................................

// Android (Capacitor)
// import { Plugins } from '@capacitor/core';
// const { App } = Plugins;
const _MS_PER_DAY = 1000 * 60 * 60 * 24;
class AppComponent extends Component {

  // ..... LifeCycle Hooc .....
  componentWillMount = () => {
    // .... Authentication State Listener ....
    Firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // ... Load User Image ...
        var storageRef = Firebase.storage().ref();
        var mountainsRef = storageRef.child(user.uid);
        try {
          var img = await mountainsRef.getDownloadURL();
          user.imageUrl = img ? img : undefined;
        } catch (error) {
          console.log(error);
        }
        // ... Add enc of user Mail to users list in firebase realtime db  ...
        Firebase.database()
          .ref(`users/${user.uid}`)
          .update({
            email: aes256.encrypt(this.props.enckey, user.email),
          });
        store.dispatch({ type: "SET_USER", Cu_User: user });

        Firebase.database()
          .ref(`users/${user.uid}/branches/1399`)
          .once("value", (snapshot) => {
            if (!snapshot.val()) {
              // add 
              var today = this.convertToDateFormatToStore(new Date());
              Firebase.database()
                .ref(`users/${user.uid}/branches/1399`)
                .set({
                  branchName: aes256.encrypt(this.props.enckey, "daily"),
                  id: 1399,
                  todoList: true,
                  currentDate: today,
                });
            }
          });
        this.UpdateDataBaseDay(user);
        getlistOf(user);


      } else {
        store.dispatch({ type: "SET_USER", Cu_User: null, branches: [] });
      }
    });
  };
  componentDidMount = () => {
    var currentTheme = localStorage.getItem("myTheme");
    if (currentTheme == "dark") {
      $("head").append(`<link rel="stylesheet" href="static/dark.css">`);
    } else {
      $('head link[href="static/dark.css"]').remove();
    }
    window.addEventListener("touchstart", { passive: true })

    $("body").niceScroll({
      cursorcolor: "#4e54c8",
      scrollspeed: 60,
      cursorborder: "none",
      smoothscroll: true,
      cursorwidth: "8px",
      cursorminheight: 50,
      cursorborderradius: "5px",
      railpadding: { top: 0, right: 1, left: 0, bottom: 0 },
    });

    // create an Observer instance
    const resizeObserver = new ResizeObserver(entries => {
      $("body").getNiceScroll().resize();
    }
    )
    // start observing a DOM node
    resizeObserver.observe(document.body)

    // Android (Capacitor)
    // document.addEventListener("backbutton", async function (e) {
    //   const path = window.location.hash;
    //   if (path == "#/" || path == "#/signUP" || path == "#/login" || path.startsWith("#/branches")) {
    //     App.exitApp();
    //   }
    //   else {
    //     window.history.back();
    //   }
    // });
  };

  render() {

    return (
      <div className="todo-app ">
        <Header />
        {/* <TitleBar options={options} />  */}
        <BrowserRouter>
          <Route exact path="/" component={Loader} />
          <Route path="/login" component={Login} />
          <Route path="/signUP" component={SignUp} />
          <Route path="/profile/:user_id" component={Profile} />
          <Route path="/branches/:user_id" component={Branches} />
          <Route path={`/todoList/:branchName`} component={Todos} />

        </BrowserRouter>
      </div>

    );
  }


  // ..... Help Methods .....
  dateDiffInDays(a, b) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  convertToDateFormatToStore = (data) => {
    var today = new Date(data);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + "-" + dd + "-" + yyyy;
    return today;
  };

  UpdateDataBaseDay = async (user) => {
    if (this.props.userBranches) {
      return Firebase.database()
        .ref(`users/${user.uid}/branches/1399`)
        .once("value", (snapshot) => {
          var values = snapshot.val();
          if (values && values.todoList) {
            var today = new Date();
            var currentDate = new Date(values.currentDate);
            var diffDays = this.dateDiffInDays(currentDate, today);
            let historyData = values.history && values.history != true ? values.history : {};
            if (diffDays > 0) {
              // Save Last todolist Data 


              let lastDay = this.convertToDateFormatToStore(
                new Date(
                  new Date(currentDate).getTime() +
                  (diffDays - 1) * (_MS_PER_DAY)
                )
              );
              historyData[lastDay] = { todoList: values.todoList ? values.todoList : true }
              Firebase.database().ref(`users/${user.uid}/branches/1399/history/${lastDay}`).set({ todoList: values.todoList ? values.todoList : true });

              // Reset Active Todolist 
              for (var i = 0; i < Object.keys(values.todoList).length; i++) {
                Firebase.database().ref(`users/${user.uid}/branches/1399/todoList/${Object.keys(values.todoList)[i]}`)
                  .update({
                    status: "needed",
                  });
              }

              // update Cuurent Day Value
              Firebase.database().ref(`users/${user.uid}/branches/1399`).update({ currentDate: this.convertToDateFormatToStore(today), });

              let todolistAllNeed = values.todoList ? values.todoList : true;
              for (let i = 0; i < diffDays - 1; i++) {
                historyData[this.convertToDateFormatToStore(currentDate)] = { todoList: todolistAllNeed }
                currentDate = new Date(
                  new Date(currentDate).getTime() + _MS_PER_DAY
                );
              }
              Firebase.database().ref(`users/${user.uid}/branches/1399`)
                .update({
                  history: historyData
                });
            }
            getLineChartData(historyData);
          }
        });

    }

  };



  // ..... Desktop Tool Bar.....
  // let options = {
  //   backgroundColor: "#000",
  //   iconsColor: "#FFF",
  //   title: "Trying",
  //   titleColor: "#FFF",
  //   icon: true,
  //   closeIconClass: "fa fa-times",
  //   maximizeIconClass: "fa fa-square-o",
  //   minimizeIconClass: "fa fa-minus",
  // };
  // ..... ..... ..... ..........





}

const mapSatteToProps = (state) => {
  return {
    user: state.currentUser,
    userBranches: state.branches,
    enckey: state.encKey
  };
};
export default withRouter(connect(mapSatteToProps)(AppComponent));
