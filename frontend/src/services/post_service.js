import apiInstance from "../interceptors";

const postService = {};

postService.createPost = (data) => {
  return apiInstance.post("/posts", data);
};

postService.getPosts = (data) => {
  const params = {};
  if (data?.currentPage) params.currentPage = data.currentPage;
  if (data?.perPageLimit) params.perPageLimit = data.perPageLimit;

  return apiInstance.get(`/posts`, { params });
};

const likeDislikeControllers = {};

postService.likeDislikePost = (data) => {
  // cancel previous request
  likeDislikeControllers[data.postId]?.abort();

  const controller = new AbortController();
  likeDislikeControllers[data.postId] = controller;

  return apiInstance
    .put("/posts/like-dislike", data, { signal: controller.signal })
    .finally(() => {
      delete likeDislikeControllers[data.postId];
    });
};

postService.deletePost = (data) => {
  return apiInstance.delete(`/posts/${data.postId}`);
};

export default postService;
