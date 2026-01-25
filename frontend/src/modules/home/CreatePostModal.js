import { Box, Modal } from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import AddToPhotosIcon from "@mui/icons-material/AddToPhotos";
import { useDispatch, useSelector } from "react-redux";
import { createPostAction, getPostsAction } from "../../redux/post_store";
import Spinner from "../../components/Spinner";

const CreatePostModal = (props) => {
  const postState = useSelector((state) => state.post);

  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");

  const dispatch = useDispatch();

  const selectFile = (e) => {
    const selectedFile = e.target.files[0];

    let fileType = selectedFile.type.startsWith("image") ? "photo" : "video";
    setMediaType(fileType);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = () => {
      setMedia(reader.result);
    };
  };

  const createPost = async () => {
    const res = await dispatch(createPostAction({ desc, media, mediaType }));
    if (res) {
      props.closeModal();
      props.setPage(1);
      props.setPosts([]);
      props.fetchPosts();
      setDesc("");
      setMedia(null);
      setMediaType("");
    }
  };

  return (
    <Modal
      open={props.isModalOpen}
      onClose={props.closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="absolute left-1/2 top-1/2 w-[20rem] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#082329] p-4 rounded-md shadow-lg border-none outline-none createPostModalBox">
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-gray-300">
          <h3 className="text-gray-700 font-semibold">Create Post</h3>
          <CancelIcon
            className="text-red-600 cursor-pointer text-[1.3rem]"
            onClick={props.closeModal}
          />
        </div>

        {/* Body */}
        <div className="mt-3">
          <input
            className="w-full p-1 outline-none border-b border-gray-200 focus:border-gray-400 transition bg-transparent"
            type="text"
            placeholder="Write something here..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <div className="flex justify-center mt-3">
            {!media ? (
              <>
                <label
                  htmlFor="uploadFile"
                  className="flex flex-col items-center w-full p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#051316] rounded-md border border-gray-300 transition"
                >
                  <AddToPhotosIcon className="rounded-full p-2 mb-2 !text-[2rem] shadow-md dark:shadow-[0_2px_10px_rgba(255,255,255,0.2)]" />
                  <p className="text-gray-600 text-sm">Add photos/videos</p>
                </label>
                <input
                  id="uploadFile"
                  type="file"
                  accept="image/*, video/*"
                  onChange={selectFile}
                  className="hidden"
                />
              </>
            ) : (
              <div className="relative w-full">
                {mediaType === "photo" ? (
                  <img
                    src={media}
                    alt="preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <video
                    controls
                    className="w-full h-48 object-cover rounded-md"
                  >
                    <source src={media} />
                  </video>
                )}
                <CancelIcon
                  className="absolute top-2 right-2 text-gray-500 cursor-pointer bg-white rounded-full p-1"
                  onClick={() => setMedia(null)}
                />
              </div>
            )}
          </div>

          {/* Post Button */}
          <button
            onClick={createPost}
            className="w-full mt-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer flex justify-center items-center gap-2 transition"
          >
            {postState.loading.createPost ? (
              <Spinner color="aliceblue" size="1.3rem" />
            ) : (
              "Post"
            )}
          </button>
        </div>
      </Box>
    </Modal>
  );
};

export default CreatePostModal;
