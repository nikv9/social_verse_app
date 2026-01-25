import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { deletePostAction } from "../../redux/post_store";
import { useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { getUserPostsAction } from "../../redux/user_store";

const Posts = () => {
  const { userPosts } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const params = useParams();

  const [hoverPost, setHoverPost] = useState(null);

  const [isDeletePostModalShow, setIsDeletePostModalShow] = useState(false);
  const [postId, setPostId] = useState("");

  const showDeletePostModal = (pId) => {
    setPostId(pId);
    setIsDeletePostModalShow(true);
  };

  const hideDeletePostModal = () => {
    setIsDeletePostModalShow(false);
  };

  const hoverOnPost = (postId) => {
    setHoverPost(postId);
  };

  const endHoverOnPost = () => {
    setHoverPost(null);
  };

  const deletePost = async () => {
    await dispatch(deletePostAction({ postId }));
    dispatch(getUserPostsAction(params.id));
    hideDeletePostModal();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-10 mt-8">
      {userPosts.length === 0 ? (
        <div className="err_clr font-semibold">No post available !</div>
      ) : (
        userPosts.map((item) => (
          <div
            className="p-2 min-h-[14rem] min-w-[15rem] max-h-[14rem] max-w-[15rem] border border-gray-300 rounded-sm"
            key={item._id}
            onMouseEnter={() => hoverOnPost(item._id)}
            onMouseLeave={endHoverOnPost}
          >
            {hoverPost === item._id && (
              <div className="flex justify-end ">
                <CancelRoundedIcon
                  className="err_clr"
                  sx={{ cursor: "pointer" }}
                  onClick={() => showDeletePostModal(item._id)}
                />
              </div>
            )}

            {item.media.mediaUrl ? (
              <div>
                {item.mediaType === "photo" ? (
                  <img
                    src={item.media.mediaUrl}
                    alt=""
                    className="w-full object-contain h-[10rem]"
                  />
                ) : (
                  <video controls className="w-full object-contain h-[10rem]">
                    <source src={item.media.mediaUrl} />
                  </video>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[10rem] text-gray-300">
                <ImageNotSupportedIcon className="!text-[4rem]" />
              </div>
            )}

            <p className="text-sm mt-2">
              {item?.description.length > 20
                ? `${item?.description}...`
                : item?.description}
            </p>
          </div>
        ))
      )}

      {isDeletePostModalShow && (
        <Modal hideModal={hideDeletePostModal} title="Delete Post">
          {{
            content: (
              <div>
                <div>Are you sure you want to delete this post ?</div>
                <div className="flex justify-end mt-2">
                  <button className="globalBtn err_bg" onClick={deletePost}>
                    Delete
                  </button>
                </div>
              </div>
            ),
          }}
        </Modal>
      )}
    </div>
  );
};

export default Posts;
