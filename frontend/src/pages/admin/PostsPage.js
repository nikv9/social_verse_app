import React from "react";
import PostList from "../../modules/admin/post/PostList";

const PostsPage = () => {
  return (
    <div className="flex-[4]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="font-bold">POST LIST</p>
        </div>

        <div className="mt-2">
          <PostList />
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
