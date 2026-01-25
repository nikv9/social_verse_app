import React from "react";
import ForgotPass from "../../modules/auth/ForgotPass";

const ForgotPassword = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="flex items-center justify-center mt-32">
        <ForgotPass />
      </div>
    </div>
  );
};

export default ForgotPassword;
