import React, { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clrAuthStateMsg, resetPassAction } from "../../redux/auth_store";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { toast } from "react-toastify";

const ResetPass = (props) => {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");
  const navigate = useNavigate();

  const resetPass = (e) => {
    e.preventDefault();
    dispatch(resetPassAction({ token, password, confirmPassword }));
  };

  useEffect(() => {
    const { error, success } = authState;
    if (error || success) {
      toast[error ? "error" : "success"](error || success);
      dispatch(clrAuthStateMsg());
      success && navigate("/login");
    }
  }, [authState.error, authState.success, dispatch]);

  return (
    <div className="p-4 bg-white shadow-md w-[25rem]">
      <p className="primary_clr text-center mt-1 text-xl">Change Password</p>
      <form className="p-3 mt-3" onSubmit={resetPass}>
        <div className="flex items-center mb-5 border border-gray-500">
          <LockOpenIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="text"
            placeholder="Password"
            required
            className="p-2.5 w-full border-none outline-none bg-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center mb-5 border border-gray-500">
          <LockOpenIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="password"
            placeholder="Confirm password"
            required
            className="p-2.5 w-full border-none outline-none text-gray-700 bg-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="globalBtn bg-[crimson] font-bold w-full mt-3 flex items-center justify-center"
          type="submit"
        >
          {authState.loading.rstPwd ? (
            <Spinner color="aliceblue" size="1.3rem" />
          ) : (
            "SUBMIT"
          )}
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
