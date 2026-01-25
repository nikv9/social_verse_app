import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import userIcon from "../../assets/imgs/avatar.jpg";
import {
  manageFollowRelationAction,
  getUserAction,
} from "../../redux/user_store";
import { Link, useParams } from "react-router-dom";
import LoadingDots from "../../components/LoadingDots";

const Followings = () => {
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const params = useParams();

  const [clickedUserId, setClickedUserId] = useState("");

  const manageFollowRelation = async (targetUserId) => {
    setClickedUserId(targetUserId);
    await dispatch(
      manageFollowRelationAction({
        loggedinUserId: authState.user._id,
        targetUserId,
        action: "removeFollowing",
      })
    );
    await dispatch(getUserAction(params.id));
  };

  return (
    <div className="pt-10">
      {userState.user.followings.length === 0 ? (
        <div className="err_clr font-semibold">No followings !</div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center items-center">
          {userState.user.followings.map((u) => (
            <Link
              className="flex flex-col justify-center items-center gap-2 py-4 px-8 border border-gray-300 shadow rounded-md cursor-pointer"
              to={`/profile/${u._id}?isOther=true`}
              key={u._id}
            >
              <div className="flex flex-col items-center gap-4">
                {u.profileImg?.imgUrl ? (
                  <img
                    src={u.profileImg.imgUrl}
                    alt=""
                    className="h-[5rem] w-[5rem] object-cover border-2 border-gray-300 rounded-full p-1"
                  />
                ) : (
                  <img
                    src={userIcon}
                    alt=""
                    className="h-[5rem] w-[5rem] object-cover border-2 border-gray-300 rounded-full p-1"
                  />
                )}
                <span>{u.name}</span>
              </div>
              {authState.user._id === userState.user._id && (
                <div className="">
                  {userState.loading.manageFollowRelation &&
                  clickedUserId === u._id ? (
                    <LoadingDots />
                  ) : (
                    <button
                      className="globalBtn err_bg !py-1 !text-xs"
                      onClick={() => manageFollowRelation(u._id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Followings;
