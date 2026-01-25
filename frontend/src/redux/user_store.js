import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user_service";
import { updateAuthUser } from "./auth_store";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: null,
    suggestedUsers: [],
    suggestedUsersBySearch: [],
    followersBySearch: [],
    followReqs: [],
    userPosts: [],
    usersAndPosts: null,
    error: null,
    success: null,
    loading: {
      getUser: false,
      users: false,
      deleteUser: false,
      createOrUpdateUser: false,
      suggestedUsers: false,
      suggestedUsersBySearch: false,
      followersBySearch: false,
      sendFollowReq: false,
      respondFollowReq: false,
      getFollowReqs: false,
      manageFollowRelation: false,
      usersAndPosts: false,
      getUserPosts: false,
    },
  },
  reducers: {
    actionStart: (state, action) => {
      state.loading[action.payload?.loadingType] = true;
    },

    actionSuccess: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));
      if (action.payload?.user) {
        state.user = action.payload.user;
      }

      if (action.payload?.users) {
        state.users = action.payload.users;
      }

      if (action.payload?.userPosts) {
        state.userPosts = action.payload.userPosts;
      }

      if (action.payload?.suggestedUsersBySearch) {
        state.suggestedUsersBySearch = action.payload.suggestedUsersBySearch;
      }

      if (action.payload?.suggestedUsers) {
        state.suggestedUsers = action.payload.suggestedUsers;
      }

      if (action.payload?.followersBySearch) {
        state.followersBySearch = action.payload.followersBySearch;
      }

      if (action.payload?.followReqs) {
        state.followReqs = action.payload.followReqs;
      }

      if (action.payload?.usersAndPosts) {
        state.usersAndPosts = action.payload.usersAndPosts;
      }

      if (action.payload?.success) {
        state.success = action.payload.success;
      }
    },

    actionFailure: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));
      state.error = action.payload;
    },

    clrUserStateMsg: (state) => {
      state.success = null;
      state.error = null;
    },

    clrUser: (state) => {
      state.user = null;
    },
  },
});

export const {
  actionStart,
  actionSuccess,
  actionFailure,
  clrUserStateMsg,
  clrUser,
} = userSlice.actions;

export default userSlice.reducer;

// actions
export const getUsersAction = (data) => async (dispatch) => {
  try {
    const payloadKey =
      data.searchType === "followers"
        ? "followersBySearch"
        : data.searchType === "userSuggestions"
        ? "suggestedUsersBySearch"
        : data.searchType === "userSuggested"
        ? "suggestedUsers"
        : "users";

    dispatch(actionStart({ loadingType: payloadKey }));
    const res = await userService.getUsers(data);

    dispatch(actionSuccess({ [payloadKey]: res }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const getUserAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "getUser" }));
    const res = await userService.getUser(data);
    dispatch(actionSuccess({ user: res }));
  } catch (error) {
    dispatch(actionFailure(error.msg || error.response?.data?.msg));
  }
};

export const getUserPostsAction = (userId) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "userPosts" }));
    const res = await userService.getUserPosts(userId);
    dispatch(
      actionSuccess({
        userPosts: res,
      })
    );
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const sendFollowReqAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "sendFollowReq" }));
    const res = await userService.sendFollowReq(data);
    dispatch(actionSuccess({ success: res.msg }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};
export const respondFollowReqAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "respondFollowReq" }));
    const res = await userService.respondFollowReq(data);
    dispatch(actionSuccess({ success: res.msg }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};
export const getFollowReqsAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "getFollowReqs" }));
    const res = await userService.getFollowReqs(data);
    dispatch(actionSuccess({ followReqs: res }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};
export const manageFollowRelationAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "manageFollowRelation" }));
    const res = await userService.manageFollowRelation(data);
    dispatch(actionSuccess({ success: res.msg }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const deleteUserAction = (userId) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "deleteUser" }));
    const res = await userService.deleteUser(userId);
    dispatch(actionSuccess({ success: res }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const createOrUpdateUserAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "createOrUpdateUser" }));
    const res = await userService.createOrUpdateUser(data);
    dispatch(
      actionSuccess({
        success: data.id
          ? "User updated successfully"
          : "User created successfully",
      })
    );
    if (data.isNotAdmin) {
      dispatch(updateAuthUser(res));
    }
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const getAllUsersAndPostsAction = () => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "getUserPosts" }));
    const res = await userService.getAllUsersAndPosts();
    dispatch(actionSuccess({ usersAndPosts: res }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};
