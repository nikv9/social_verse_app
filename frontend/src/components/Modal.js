import React from "react";
import CancelIcon from "@mui/icons-material/Cancel";

const Modal = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-[999]"
      onClick={props.hideModal}
    >
      <div
        className="bg-white rounded-md p-3 w-[20%]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1 border-b border-gray-300">
          <p>{props.title}</p>
          <CancelIcon
            className="err_clr cursor-pointer"
            sx={{ fontSize: "1.4rem" }}
            onClick={props.hideModal}
          />
        </div>
        <div className="mt-4">{props.children.content}</div>
      </div>
    </div>
  );
};

export default Modal;
