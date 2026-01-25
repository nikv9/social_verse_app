import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import authService from "../services/auth_service";
import Cookies from "js-cookie";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import { baseUrl } from "../config/api_config";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: null,
    success: null,
    loading: {
      signup: false,
      signin: false,
      signinGoogle: false,
      fgtPwd: false,
      rstPwd: false,
    },
  },

  reducers: {
    actionStart: (state, action) => {
      state.loading[action.payload.loadingType] = true;
    },
    actionSuccess: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));
      state.user = action.payload.user;
      state.success = action.payload.success;
    },
    actionFailure: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));
      state.error = action.payload;
    },
    updateAuthUser: (state, action) => {
      // update only changed user fields while keeping existing data intact
      state.user = { ...state.user, ...action.payload };
    },
    clrUser: (state) => {
      state.user = null;
    },
    clrAuthStateMsg: (state) => {
      state.error = null;
      state.success = null;
    },
  },
});

export const {
  actionStart,
  actionSuccess,
  actionFailure,
  updateAuthUser,
  clrUser,
  clrAuthStateMsg,
} = authSlice.actions;

export default authSlice.reducer;

// actions
export const signupAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "signup" }));

    const user = await authService.signup(data);

    if (user.data) {
      Cookies.set("tokenId", user.data.tokenId);
    }

    dispatch(
      actionSuccess({
        user: user.data,
        success: "Account created successfully!",
      })
    );
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};

export const signinAction = (email, password) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "signin" }));
    const res = await authService.signin(email, password);
    if (res) {
      Cookies.set("tokenId", res.tokenId);
      localStorage.setItem("user", JSON.stringify(res));
    }
    dispatch(actionSuccess({ user: res, success: "Login successfully!" }));
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};

export const signinWithGoogleAction = () => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "signinGoogle" }));

    const result = await signInWithPopup(auth, provider);
    const res = await axios.post(`${baseUrl}/signin/google`, {
      name: result.user.displayName,
      email: result.user.email,
      profileImg: {
        imgUrl: result.user.photoURL,
      },
    });
    if (res.data) {
      Cookies.set("tokenId", res.data.tokenId);
      localStorage.setItem("user", JSON.stringify(res));
    }

    dispatch(
      actionSuccess({
        user: res.data,
        success: "Login successfully!",
      })
    );
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};

export const forgotPassAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "fgtPwd" }));

    const res = await authService.forgotPass(data);
    dispatch(actionSuccess({ success: res }));
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};

export const resetPassAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "rstPwd" }));

    const res = await authService.resetPass(data);
    dispatch(actionSuccess({ success: res }));
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    await axios.get(`${baseUrl}/logout`);
    dispatch(clrUser());
    Cookies.remove("tokenId");
    localStorage.removeItem("user");
  } catch (error) {
    dispatch(actionFailure(error.msg));
  }
};
