import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendFollowReqAction,
  getFollowReqsAction,
  clrUserStateMsg,
  respondFollowReqAction,
} from "../../redux/user_store";
import Spinner from "../../components/Spinner";
import userIcon from "../../assets/imgs/avatar.jpg";
import { toast } from "react-toastify";
import LoadingDots from "../../components/LoadingDots";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UndoIcon from "@mui/icons-material/Undo";
import { Link } from "react-router-dom";

const FollowReqs = (props) => {
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [clickedUserId, setClickedUserId] = useState("");

  const respondFollowReq = async (targetUserId, action) => {
    setIsLoading(true);
    setClickedUserId(targetUserId);
    await dispatch(
      respondFollowReqAction({
        loggedinUserId: authState.user._id,
        targetUserId,
        action,
      })
    );
    await dispatch(getFollowReqsAction(authState.user._id));
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(getFollowReqsAction(authState.user._id));
  }, [dispatch, authState.user._id]);

  useEffect(() => {
    if (userState.success) {
      toast.success(userState.success);
      dispatch(clrUserStateMsg());
    }
  }, [dispatch, userState.success]);

  return (
    <div className="flex-[4]">
      {userState.loading.getFollowReqs && isLoading === false ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Spinner color="gray" size="3rem" />
        </div>
      ) : (props.activeTab === 1
          ? userState.followReqs?.reqReceived
          : userState.followReqs?.reqSent
        )?.length > 0 ? (
        <div className="flex flex-wrap gap-10 items-center p-4">
          {(props.activeTab === 1
            ? userState.followReqs?.reqReceived
            : userState.followReqs?.reqSent
          )?.map((u) => {
            return (
              <div
                className="shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                key={u._id}
              >
                <Link
                  to={`/profile/${u._id}?isOther=true`}
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {u.profileImg?.imgUrl ? (
                    <img
                      src={u.profileImg.imgUrl}
                      alt=""
                      className="h-[10rem] w-[10rem] object-cover"
                    />
                  ) : (
                    <img
                      src={userIcon}
                      alt=""
                      className="h-[10rem] w-[10rem] object-cover"
                    />
                  )}
                  <p>{u.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  {userState.loading.respondFollowReq &&
                  clickedUserId === u._id ? (
                    <LoadingDots />
                  ) : (
                    <div className="flex gap-2 items-center py-1">
                      {props.activeTab === 1 ? (
                        <>
                          <button
                            className="flex items-center justify-center p-2 bg-green-100 text-green-700 rounded"
                            onClick={() => respondFollowReq(u._id, "accept")}
                          >
                            <CheckCircleIcon sx={{ fontSize: "1rem" }} />
                          </button>
                          <button
                            className="flex items-center justify-center p-2 bg-red-100 text-red-600 rounded"
                            onClick={() => respondFollowReq(u._id, "reject")}
                          >
                            <CancelIcon sx={{ fontSize: "1rem" }} />
                          </button>
                        </>
                      ) : (
                        <button
                          className="flex items-center justify-center p-2 bg-blue-100 text-[#1b49e1] rounded"
                          onClick={() => respondFollowReq(u._id, "withdraw")}
                        >
                          <UndoIcon sx={{ fontSize: "1rem" }} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="err_clr h-[70vh] flex justify-center items-center">
          No {props.activeTab === 1 ? "Received" : "Sent"} Requests
        </div>
      )}
    </div>
  );
};

export default FollowReqs;
