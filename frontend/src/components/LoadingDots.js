import React from "react";

const LoadingDots = () => {
  const loaderDot = {
    animation: "1s blink infinite",
    padding: "0.25rem",
    borderRadius: "50%",
    backgroundColor: "black",
  };

  const loaderDot2 = {
    ...loaderDot,
    animationDelay: "250ms",
  };

  const loaderDot3 = {
    ...loaderDot,
    animationDelay: "500ms",
  };

  const keyframesStyle = `
        @keyframes blink {
          50% { background-color: transparent; }
        }
      `;

  return (
    <div className="flex gap-1">
      <style>{keyframesStyle}</style>
      <div style={loaderDot}></div>
      <div style={loaderDot2}></div>
      <div style={loaderDot3}></div>
    </div>
  );
};

export default LoadingDots;
