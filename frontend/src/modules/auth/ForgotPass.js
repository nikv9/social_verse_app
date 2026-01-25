import React, { useEffect, useState } from "react";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { clrAuthStateMsg, forgotPassAction } from "../../redux/auth_store";
import { toast } from "react-toastify";

const ForgotPass = (props) => {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const forgotPass = (e) => {
    e.preventDefault();
    dispatch(forgotPassAction(email));
  };

  useEffect(() => {
    const { error, success } = authState;
    if (error || success) {
      toast[error ? "error" : "success"](error || success);
      dispatch(clrAuthStateMsg());
    }
  }, [authState.error, authState.success, dispatch]);

  return (
    <div className="p-4 shadow-lg w-[25rem]">
      <p className="primary_clr text-center mt-1 text-xl">
        Get a reset password link
      </p>
      <form className="p-3 mt-3" onSubmit={forgotPass}>
        <div className="flex items-center mb-5 border border-gray-500 rounded">
          <MailOutlineIcon className="text-gray-400 ml-2 text-xl" />
          <input
            type="email"
            placeholder="Email"
            required
            className="p-2.5 w-full border-none outline-none bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="globalBtn bg-[crimson] font-bold w-full mt-3 flex items-center justify-center"
          type="submit"
        >
          {authState.loading.fgtPwd ? (
            <Spinner color="aliceblue" size="1.3rem" />
          ) : (
            "SUBMIT"
          )}
        </button>
      </form>
    </div>
  );
};

export default ForgotPass;
