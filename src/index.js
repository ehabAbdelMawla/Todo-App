import React from "react";
import ReactDOM from "react-dom";
import AppComponent from "./Components/App";
import { HashRouter as Router } from "react-router-dom";
import * as serviceWorker from "./Components/serviceWorker";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./Components/rootReducer";
import _ from "./Components/firebaseConfig";


const store = createStore(rootReducer);

ReactDOM.render(

  <Provider store={store}>
    <Router>
      <AppComponent />
    </Router>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
export default store;
