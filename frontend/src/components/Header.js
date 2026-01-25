import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@mui/material";
import { getUsersAction } from "../redux/user_store";
import Spinner from "./Spinner";
import userIcon from "../assets/imgs/avatar.jpg";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { logoutAction } from "../redux/auth_store";

const Header = () => {
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [theme, setTheme] = useState("dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const searchUsers = (e) => {
    const inputVal = e.target.value;
    setSearchText(inputVal);
    dispatch(
      getUsersAction({
        userId: authState.user._id,
        userName: inputVal,
        searchType: "userSuggestions",
      })
    );
  };

  const goToProfilePage = (userId) => {
    setSearchText("");
    navigate(`/profile/${userId}?isOther=true`);
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <>
      <div
        className="flex items-center justify-between w-full sticky top-0 h-16 z-10 shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
        style={{ backgroundColor: "var(--themeBg" }}
      >
        <div className="pl-7">
          <Link to="/">
            <h3 className="primary_clr text-[.9rem] uppercase tracking-[.5rem] font-semibold">
              cnectify
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-8 pr-5 headerOptsContainer">
          {authState.user && (
            <>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded w-80 px-2 ">
                  <SearchIcon className="text-gray-300 text-xl" />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="w-full py-2.5 px-1 outline-none border-none text-sm bg-transparent"
                    value={searchText}
                    onChange={searchUsers}
                  />
                </div>

                {userState.suggestedUsersBySearch.length > 0 && searchText && (
                  <div className="absolute top-12 p-2 bg-white shadow-md w-full flex flex-col gap-2">
                    {userState.loading.suggestedUsersBySearch ? (
                      <div className="flex justify-center">
                        <Spinner size="2rem" color="gray" />
                      </div>
                    ) : (
                      userState?.suggestedUsersBySearch.map((u) => (
                        <div
                          className="flex items-center gap-4 cursor-pointer hover:bg-gray-200 p-2"
                          onClick={() => goToProfilePage(u._id)}
                          key={u._id}
                        >
                          <img
                            src={
                              u.profileImg?.imgUrl
                                ? u.profileImg.imgUrl
                                : userIcon
                            }
                            alt=""
                            className="h-[2.5rem] w-[2.5rem] object-cover border-2 border-gray-300 rounded-full p-1"
                          />
                          <p className="text-black">{u.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {authState.user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="text-[crimson] underline"
                >
                  Admin Panel
                </Link>
              )}

              <Link to="/chat">
                <TelegramIcon className="cursor-pointer text-gray-500 p-2.5 rounded-full bg-gray-200 !text-[2.5rem]" />
              </Link>

              <Link to={`/profile/${authState.user._id}`}>
                <Avatar
                  className="bg-gray-200"
                  src={authState.user?.profileImg?.imgUrl}
                />
              </Link>
            </>
          )}
          <button
            onClick={toggleTheme}
            className="h-10 w-10 rounded-full border border-gray-500"
          >
            {theme === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </button>
        </div>

        <div className="hamburger">
          <button
            className="h-9 w-9 mr-4 rounded border flex items-center justify-center"
            onClick={() => setIsMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* hamburger drawer  */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-[#082329] shadow-lg z-50 transform transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button className="text-2xl" onClick={() => setIsMenuOpen(false)}>
            ✕
          </button>
        </div>

        <div className="px-4 flex flex-col gap-6">
          {authState.user && (
            <>
              <Link
                to={`/profile/${authState.user._id}`}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <Avatar src={authState.user.profileImg?.imgUrl} />
                <span>{authState.user.name}</span>
              </Link>

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchText}
                  onChange={searchUsers}
                  className="w-full p-2 rounded border bg-transparent"
                />

                {userState.suggestedUsersBySearch.length > 0 && searchText && (
                  <div className="absolute top-12 left-0 right-0 p-2 bg-white dark:bg-[#082329] shadow-md flex flex-col gap-2 z-50">
                    {userState.loading.suggestedUsersBySearch ? (
                      <div className="flex justify-center py-2">
                        <Spinner size="2rem" color="gray" />
                      </div>
                    ) : (
                      userState.suggestedUsersBySearch.map((u) => (
                        <div
                          key={u._id}
                          onClick={() => {
                            setIsMenuOpen(false);
                            goToProfilePage(u._id);
                          }}
                          className="flex items-center gap-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#0b2a28] p-2 rounded"
                        >
                          <img
                            src={
                              u.profileImg?.imgUrl
                                ? u.profileImg.imgUrl
                                : userIcon
                            }
                            alt=""
                            className="h-[2.5rem] w-[2.5rem] object-cover border-2 border-gray-300 rounded-full p-1"
                          />
                          <p className="text-sm">{u.name}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {authState.user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-blue-500"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
          )}

          {authState.user && (
            <>
              <Link to="/chat" onClick={() => setIsMenuOpen(false)}>
                Chat
              </Link>

              <Link to="/friends" onClick={() => setIsMenuOpen(false)}>
                Connect Friends
              </Link>

              <Link to="/follow-reqs" onClick={() => setIsMenuOpen(false)}>
                Requests
              </Link>

              <p
                onClick={() => {
                  setIsMenuOpen(false);
                  dispatch(logoutAction());
                }}
                className="text-red-500"
              >
                Logout
              </p>
            </>
          )}

          <button
            onClick={toggleTheme}
            className="h-10 w-full border rounded mt-5 flex items-center justify-center"
          >
            {theme === "light" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
