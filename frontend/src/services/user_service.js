import apiInstance from "../interceptors";

const userService = {};

userService.getUser = (data) => {
  return apiInstance.get(
    data?.isOtherProfile ? `/users/${data.userId}` : `/profile`
  );
};

userService.getUsers = (data) => {
  const params = {};
  if (data?.isAdmin) {
    if (data?.isAdmin) params.isAdmin = data.isAdmin;
    if (data?.userName) params.userName = data.userName;
    if (data?.sortType) params.sort = data.sortType;
    if (data?.currentPage) params.page = data.currentPage;
    if (data?.perPage) params.limit = data.perPage;
  } else {
    if (data?.userId) params.userId = data.userId;
    if (data?.userName) params.userName = data.userName;
    if (data?.searchType) params.searchType = data.searchType;
  }

  return apiInstance.get("/users", { params });
};

userService.getUserPosts = (userId) => {
  return apiInstance.get(`/users/${userId}/posts`);
};

userService.sendFollowReq = (data) => {
  return apiInstance.post("/users/follow/request", data);
};
userService.respondFollowReq = (data) => {
  return apiInstance.post("/users/follow/respond", data);
};
userService.getFollowReqs = (userId) => {
  return apiInstance.get("/users/follow-requests", {
    params: {
      userId,
    },
  });
};

userService.manageFollowRelation = (data) => {
  return apiInstance.put("/users/follow/manage", data);
};

userService.deleteUser = (userId) => {
  return apiInstance.delete(`/users/${userId}`);
};

userService.createOrUpdateUser = (data) => {
  return apiInstance[data.isNotAdmin ? "put" : "post"](
    `/${data.isNotAdmin ? "profile" : "users"}`,
    data
  );
};

userService.getAllUsersAndPosts = () => {
  return apiInstance.get("/users-posts");
};

export default userService;
