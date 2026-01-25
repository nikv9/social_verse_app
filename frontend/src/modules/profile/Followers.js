import React from "react";
import { useSelector } from "react-redux";
import userIcon from "../../assets/imgs/avatar.jpg";
import { Link } from "react-router-dom";

const Followers = () => {
  const userState = useSelector((state) => state.user);

  return (
    <div className="pt-10 ">
      {userState.user.followers.length === 0 ? (
        <div className="err_clr font-semibold">No followers !</div>
      ) : (
        <div className="flex gap-4 flex-wrap justify-center items-center">
          {userState.user.followers.map((u) => (
            <Link
              className="flex flex-col justify-center items-center gap-4 py-4 px-8 border border-gray-300 shadow rounded-md cursor-pointer"
              to={`/profile/${u._id}?isOther=true`}
              key={u._id}
            >
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
              <p>{u.name}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Followers;
