import React, { Component } from "react";
import "../Styles/custome/circular.css";

class Circular extends Component {
  render() {
    return (
      <article className="loader">
        <svg className="circular" viewBox="25 25 50 50">
          <circle
            className="path"
            cx="50"
            cy="50"
            r="10"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </article>
    );
  }
}

export default Circular;
