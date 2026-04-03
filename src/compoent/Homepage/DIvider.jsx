
import React from "react";
import "./Divider.css";

const Divider = ({ text, style }) => {
  return (
    <div className="divider-container">
      <span className="divider-line"></span>

      {/* 👇 Inline styles will apply to text */}
      <span className="divider-text" style={style}>
        {text}
      </span>

      <span className="divider-line"></span>
    </div>
  );
};

export default Divider;
