import React from "react";
import ResetPass from "../../modules/auth/ResetPass";

const ResetPassword = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <div className="flex items-center justify-center mt-32">
        <ResetPass />
      </div>
    </div>
  );
};

export default ResetPassword;
