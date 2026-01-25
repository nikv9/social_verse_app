import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar } from "@mui/material";
import { logoutAction } from "../redux/auth_store";
import Diversity3Icon from "@mui/icons-material/Diversity3";

const MenuBar = () => {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logoutUser = () => {
    dispatch(logoutAction());
  };

  const location = useLocation();
  const activePath = location.pathname;

  return (
    <div className="!flex-1 sticky top-16 overflow-y-scroll h-[calc(100vh-4rem)] menubarContainer">
      <div className="pt-2">
        {authState.user.role === "admin" &&
        (location.pathname === "/admin/dashboard" ||
          location.pathname === "/admin/users" ||
          location.pathname === "/user" ||
          location.pathname === "/admin/posts") ? (
          <>
            {/* Dashboard */}
            <Link
              to="/admin/dashboard"
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === "/admin/dashboard" ? "primary_clr font-bold" : ""
              }`}
            >
              <PeopleOutlineIcon className="text-purple-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
              Dashboard
            </Link>

            {/* Users */}
            <Link
              to="/admin/users"
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === "/admin/users" || activePath === "/user"
                  ? "primary_clr font-bold"
                  : ""
              }`}
            >
              <PeopleOutlineIcon className="text-green-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
              Users
            </Link>

            {/* Posts */}
            <Link
              to="/admin/posts"
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === "/admin/posts" || activePath === "/post"
                  ? "primary_clr font-bold"
                  : ""
              }`}
            >
              <PermMediaIcon className="text-blue-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
              Posts
            </Link>
          </>
        ) : (
          <>
            {/* Profile */}
            <Link
              to={`/profile/${authState.user._id}`}
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === `/profile/${authState.user._id}`
                  ? "primary_clr font-bold"
                  : ""
              }`}
            >
              {authState.user.profileImg.imgUrl ? (
                <Avatar
                  className="ml-6 mr-4 text-gray-700 bg-gray-200"
                  src={authState.user.profileImg.imgUrl}
                />
              ) : (
                <Avatar className="ml-6 mr-4 text-gray-700 bg-gray-200" />
              )}
              {authState.user.name}
            </Link>

            {/* Friends */}
            <Link
              to="/friends"
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === "/friends" ? "primary_clr font-bold" : ""
              }`}
            >
              <PeopleOutlineIcon className="text-green-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
              Connect Friends
            </Link>

            {/* Requests */}
            <Link
              to="/follow-reqs"
              className={`flex items-center w-full py-3 cursor-pointer no-underline text-gray-500 hover:bg-gray-200 ${
                activePath === "/follow-reqs" ? "primary_clr font-bold" : ""
              }`}
            >
              <Diversity3Icon className="text-purple-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
              Requests
            </Link>
          </>
        )}

        {/* Logout */}
        <div
          onClick={logoutUser}
          className="flex items-center py-4 cursor-pointer hover:bg-gray-200"
        >
          <LogoutIcon className="text-red-500 p-2 flex justify-center items-center bg-gray-200 rounded-full ml-6 mr-4 !text-[2.3rem]" />
          <p className="text-gray-500">Logout</p>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
