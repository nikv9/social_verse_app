import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Followers from "../../modules/profile/Followers";
import Followings from "../../modules/profile/Followings";
import Posts from "../../modules/profile/Posts";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../../components/Spinner";
import defaultUserImg from "../../assets/imgs/avatar.jpg";
import {
  sendFollowReqAction,
  getUserAction,
  getUserPostsAction,
  manageFollowRelationAction,
} from "../../redux/user_store";
import LoadingDots from "../../components/LoadingDots";

const UserProfile = () => {
  const userState = useSelector((state) => state.user);
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const params = useParams();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const isOtherProfile = queryParams.get("isOther");

  const [activeTab, setActiveTab] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const changeTab = (tab) => {
    setActiveTab(tab);
  };

  const navigateEditProfile = () => {
    navigate(`/profile/edit?id=${params.id}`);
  };

  useEffect(() => {
    const initializeProfile = async () => {
      await dispatch(
        getUserAction({ isOtherProfile: isOtherProfile, userId: params.id })
      );
      await dispatch(getUserPostsAction(params.id));
    };
    initializeProfile();
  }, [dispatch, params.id]);

  const sendFollowReq = async (targetUserId) => {
    setIsLoading(true);
    await dispatch(
      sendFollowReqAction({
        loggedinUserId: authState.user._id,
        targetUserId,
      })
    );
    await dispatch(
      getUserAction({ isOtherProfile: isOtherProfile, userId: params.id })
    );
    setIsLoading(false);
  };

  const manageFollowRelation = async (targetUserId, action) => {
    setIsLoading(true);
    await dispatch(
      manageFollowRelationAction({
        loggedinUserId: authState.user._id,
        targetUserId,
        action,
      })
    );
    await dispatch(
      getUserAction({ isOtherProfile: isOtherProfile, userId: params.id })
    );
    setIsLoading(false);
  };

  return (
    <div className="flex w-full md:flex-[4] flex-col items-center p-3">
      {userState.loading.getUser && isLoading === false ? (
        <div className="flex items-center justify-center h-[100%]">
          <Spinner color="gray" size="3rem" />
        </div>
      ) : (
        <>
          <div className="flex gap-10 mt-5 profileInfoContainer">
            <div>
              <img
                src={
                  userState.user?.profileImg?.imgUrl
                    ? userState.user.profileImg.imgUrl
                    : defaultUserImg
                }
                alt=""
                className="rounded-full h-[10rem] w-[10rem] border border-gray-400 object-cover profileImg"
              />
            </div>
            <div className="pt-5 profileDetails">
              <h3>{userState.user?.name}</h3>
              <div className="flex items-center gap-4 mt-4">
                <span>{userState?.userPosts?.length} Posts</span>
                <span>{userState.user?.followers.length} Followers</span>
                <span>{userState.user?.followings.length} Followings</span>
              </div>
              {userState.user?._id === authState.user?._id ? (
                <div className="flex items-center gap-5 mt-5">
                  <button
                    className="globalBtn err_bg"
                    onClick={navigateEditProfile}
                  >
                    Edit Profile
                  </button>
                </div>
              ) : userState.user?.followers.some(
                  (u) => u._id === authState.user._id
                ) ? (
                <button
                  className="globalBtn err_bg mt-5"
                  onClick={() =>
                    manageFollowRelation(userState.user?._id, "removeFollowing")
                  }
                >
                  {userState.loading.manageFollowRelation ? (
                    <LoadingDots />
                  ) : (
                    "Unfollow"
                  )}
                </button>
              ) : userState.user?.followReqsReceived?.includes(
                  authState.user._id
                ) ? (
                <button className="globalBtn bg-gray-300 !text-gray-700 mt-5 !cursor-default">
                  Follow Request Sent
                </button>
              ) : (
                <button
                  className="globalBtn primary_bg mt-5"
                  onClick={() => sendFollowReq(userState.user?._id)}
                >
                  {userState.loading.sendFollowReq ? <LoadingDots /> : "Follow"}
                </button>
              )}
            </div>
          </div>
          <div className="mt-7 border-t border-gray-400 w-[80%]">
            <div className="flex items-center justify-center p-[.7rem] profileTabContainer">
              <p
                className={`${
                  activeTab === 1 && "primary_clr tracking-wide font-bold"
                } cursor-pointer px-4 py-2 flex-[1]`}
                onClick={() => changeTab(1)}
              >
                POSTS
              </p>
              <p
                className={`${
                  activeTab === 2 && "primary_clr tracking-wide font-bold"
                } cursor-pointer px-4 py-2 flex-[1]`}
                onClick={() => changeTab(2)}
              >
                FOLLOWERS
              </p>
              <p
                className={`${
                  activeTab === 3 && "primary_clr tracking-wide font-bold"
                } cursor-pointer px-4 py-2 flex-[1]`}
                onClick={() => changeTab(3)}
              >
                FOLLOWINGS
              </p>
            </div>
            <div className="">
              {activeTab === 1 && <Posts />}
              {activeTab === 2 && <Followers />}
              {activeTab === 3 && <Followings />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
