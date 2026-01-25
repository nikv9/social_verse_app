import React, { useState } from "react";
import { Avatar } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { getPostsAction, likeDislikePostAction } from "../../redux/post_store";
import Spinner from "../../components/Spinner";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Post = (props) => {
  const auth = useSelector((state) => state.auth);
  const post = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [clickedPostId, setClickedPostId] = useState("");

  const likeDislikePost = async (action) => {
    setClickedPostId(props.post._id);
    await dispatch(
      likeDislikePostAction({
        postId: props.post._id,
        userId: auth.user._id,
        action,
      })
    );
  };

  const downloadFile = async () => {
    try {
      const mediaUrl = props.post.media?.mediaUrl;
      if (!mediaUrl) {
        return toast.warn("No media to download");
      }

      const response = await fetch(mediaUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Extract file name or fallback
      const fileName = mediaUrl.split("/").pop() || "downloaded_file";

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="p-2 rounded-md mt-4 shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 px-2">
          <Link
            to={`/profile/${props.post.userId._id}?isOther=true`}
            key={props.post.userId._id}
          >
            <Avatar src={props.post.userId?.profileImg?.imgUrl} />
          </Link>
          <div>
            <h4>{props.post.userId?.name}</h4>
            <p className="text-gray-600 text-sm">
              {moment(props.post.createdAt).fromNow()} (
              {moment(props.post.createdAt).format("lll")})
            </p>
          </div>
        </div>
        <div
          className="rounded-full border p-2 cursor-pointer"
          onClick={downloadFile}
        >
          <ArrowDownwardIcon sx={{ color: "gray" }} />
        </div>
      </div>

      {props.post.media.mediaUrl && (
        <div className="p-3">
          {props.post.mediaType === "photo" ? (
            <img
              src={props.post.media.mediaUrl}
              alt=""
              className="w-full object-contain h-[25rem]"
            />
          ) : (
            <video controls className="w-full object-contain h-[25rem]">
              <source src={props.post.media.mediaUrl} />
            </video>
          )}
        </div>
      )}

      <div className="mt-4">
        <p className="m-2">{props.post.description}</p>
        <div className="flex items-center justify-between border-t border-gray-300 pt-2 px-2">
          <div className="cursor-pointer">
            {post.loading === true && props.post._id === clickedPostId ? (
              <Spinner color="#1b49e1" size="1rem" />
            ) : props.post.likes.includes(auth.user._id) ? (
              <FavoriteIcon
                sx={{ color: "red" }}
                onClick={() => likeDislikePost("dislike")}
              />
            ) : (
              <FavoriteBorderIcon
                sx={{ color: "gray" }}
                onClick={() => likeDislikePost("like")}
              />
            )}
          </div>
          <div className="">
            <span className="text-gray-600">
              {props.post.likes.length} Likes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
