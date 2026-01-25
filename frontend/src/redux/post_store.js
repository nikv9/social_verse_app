import { createSlice } from "@reduxjs/toolkit";
import postService from "../services/post_service";

const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: null,
    error: null,
    success: null,
    loading: {
      createPost: false,
      getPosts: false,
      likeDislike: false,
      deletePost: false,
    },
  },

  reducers: {
    actionStart: (state, action) => {
      state.error = null;
      state.success = null;
      state.loading[action.payload?.loadingType] = true;
    },

    actionSuccess: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));

      if (action.payload?.posts) {
        state.posts = action.payload.posts;
      }

      if (action.payload?.success) {
        state.success = action.payload.success;
      }
    },

    actionFailure: (state, action) => {
      Object.keys(state.loading).forEach((key) => (state.loading[key] = false));
      state.error = action.payload;
    },

    clrPostStateMsg: (state) => {
      state.success = null;
      state.error = null;
    },
  },
});

export const { actionStart, actionSuccess, actionFailure, clrPostStateMsg } =
  postSlice.actions;
export default postSlice.reducer;

// actions
export const createPostAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "createPost" }));
    await postService.createPost(data);
    dispatch(actionSuccess({ success: "Post uploaded!" }));
    return true;
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const getPostsAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "getPosts" }));
    const res = await postService.getPosts(data);
    dispatch(
      actionSuccess({ posts: res, success: "Posts fetched successfully!" })
    );
    return res;
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const likeDislikePostAction = (data) => async (dispatch, getState) => {
  try {
    dispatch(actionStart({ loadingType: "likeDislike" }));

    const existing = getState().post.posts;
    const existingPosts = existing.posts;

    const updatedPosts = existingPosts.map((p) => {
      if (p._id === data.postId) {
        const alreadyLiked = p.likes.includes(data.userId);

        if (data.action === "like" && !alreadyLiked) {
          return { ...p, likes: [...p.likes, data.userId] };
        } else if (data.action === "dislike" && alreadyLiked) {
          return { ...p, likes: p.likes.filter((id) => id !== data.userId) };
        }
      }
      return p;
    });

    // Keep original object, only replace posts array
    dispatch(
      actionSuccess({
        posts: {
          ...existing,
          posts: updatedPosts,
        },
      })
    );

    await postService.likeDislikePost(data);
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};

export const deletePostAction = (data) => async (dispatch) => {
  try {
    dispatch(actionStart({ loadingType: "deletePost" }));
    const res = await postService.deletePost(data);
    dispatch(actionSuccess({ success: "Post deleted successfully!" }));
  } catch (error) {
    dispatch(actionFailure(error.response?.data?.msg));
  }
};
