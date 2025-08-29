import React from "react";
import "./Divider.css";

const Divider = ({ text }) => {
  return (
    <div className="divider-container">
      <span className="divider-line"></span>
      <span className="divider-text">{text}</span>
      <span className="divider-line"></span>
    </div>
  );
};

export default Divider;
