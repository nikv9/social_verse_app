import { useEffect, useState } from "react";
import Signin from "../../modules/auth/Signin";
import Signup from "../../modules/auth/Signup";
import { toast } from "react-toastify";
import { clrAuthStateMsg } from "../../redux/auth_store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (authState.error) {
      toast.error(authState.error);
      dispatch(clrAuthStateMsg());
    }
    if (authState.user) {
      toast.success(authState.success);
      navigate("/");
      dispatch(clrAuthStateMsg());
    }
  }, [dispatch, navigate, authState.error, authState.user, authState.success]);

  const style = {
    active_tab: {
      color: "#1b49e1",
      borderBottom: "2px solid #1b49e1",
      fontWeight: "bold",
    },
  };
  return (
    <div className="flex-[1] h-[calc(100vh-4rem)] w-full">
      <div className="flex items-center justify-center">
        <div className="authFormContainer mt-10 p-3 flex items-center justify-center flex-col rounded w-[25rem] shadow-[0_0_0.3rem_rgba(0,0,0,0.5)]">
          <div className="flex items-center w-full">
            <div
              className="flex justify-center py-2 flex-1 cursor-pointer"
              style={activeTab === 1 ? style.active_tab : {}}
              onClick={() => changeTab(1)}
            >
              SIGNIN
            </div>
            <div
              className="flex justify-center py-2 flex-1 cursor-pointer"
              style={activeTab === 2 ? style.active_tab : {}}
              onClick={() => changeTab(2)}
            >
              SIGNUP
            </div>
          </div>

          <div className="w-full">
            {activeTab === 1 && <Signin changeTab={changeTab} />}
            {activeTab === 2 && <Signup changeTab={changeTab} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
