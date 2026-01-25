import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Login from "./pages/auth/Login";
import UserProfile from "./pages/profile/UserProfile.js";
import Home from "./pages/home/Home";
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./routes/protected_route";
import Cookies from "js-cookie";
import { clrUser, logoutAction } from "./redux/auth_store";
import Header from "./components/Header";
import MenuBar from "./components/MenuBar";
import { jwtDecode } from "jwt-decode";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Chat from "./pages/chat/Chat";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import UserPage from "./pages/admin/UserPage.js";
import PostsPage from "./pages/admin/PostsPage.js";
import FriendSuggestionsPage from "./pages/user/FriendSuggestionsPage.js";
import ResetPassword from "./pages/auth/ResetPassword.js";
import FollowReqsPage from "./pages/user/FollowReqsPage.js";
import { socket } from "./socket/socket.js";

const App = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const route = useLocation();

  useEffect(() => {
    const initializeApp = () => {
      const token = Cookies.get("tokenId");
      const path = window.location.pathname;
      if (!token && path !== "/pass/forgot" && path !== "/pass/reset") {
        dispatch(clrUser());
        navigate("/login");
      }
      if (token) {
        const decodedToken = jwtDecode(token);
        const remainingTime = decodedToken.exp - Date.now() / 1000;
        const intervalId = setTimeout(() => {
          if (decodedToken.exp < Date.now() / 1000) {
            alert(
              '"Oops! It looks like your session has expired. Please login again.'
            );
            dispatch(logoutAction());
          }
        }, remainingTime * 1000);

        return () => {
          clearTimeout(intervalId);
        };
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (auth?.user?._id) {
      socket.emit("joinUser", auth.user._id);
    }
  }, [auth.user]);

  return (
    <div className="app">
      <div>
        <Header />
        <div className={!route.pathname.includes("chat") ? "flex" : ""}>
          {auth.user && !route.pathname.includes("chat") && <MenuBar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/pass/forgot" element={<ForgotPassword />} />
            <Route path="/pass/reset" element={<ResetPassword />} />

            <Route
              path="/"
              element={
                <ProtectedRoute auth={auth.user}>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute auth={auth.user}>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute auth={auth.user}>
                  <UserPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/friends"
              element={
                <ProtectedRoute auth={auth.user}>
                  <FriendSuggestionsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/follow-reqs"
              element={
                <ProtectedRoute auth={auth.user}>
                  <FollowReqsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute auth={auth.user}>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <ProtectedRoute auth={auth.user}>
                  <Chat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute auth={auth.user} role="admin">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute auth={auth.user} role="admin">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute auth={auth.user} role="admin">
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/posts"
              element={
                <ProtectedRoute auth={auth.user} role="admin">
                  <PostsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
