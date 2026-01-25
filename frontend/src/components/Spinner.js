import React from "react";

const Spinner = (props) => {
  const spinnerStyle = {
    borderBottomWidth: "0.15rem",
    borderBottomStyle: "solid",
    borderBottomColor: props.color,
    borderRadius: "50%",
    animation: "spinner 0.5s linear infinite",
    height: props.size,
    width: props.size,
  };
  return <div style={spinnerStyle}></div>;
};

export default Spinner;
