import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import userIcon from "../../assets/imgs/avatar.jpg";
import Spinner from "../../components/Spinner";
import { getUsersAction } from "../../redux/user_store";
import {
  accessChatThunk,
  getChatsThunk,
  upsertChat,
} from "../../redux/chat_store";
import { socket } from "../../socket/socket";

const ChatList = () => {
  const authState = useSelector((state) => state.auth);
  const userState = useSelector((state) => state.user);
  const chatState = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const searchFriends = (e) => {
    const inputVal = e.target.value;
    setSearchText(inputVal);
    dispatch(
      getUsersAction({
        userId: authState.user._id,
        userName: inputVal,
        searchType: "followers",
      })
    );
  };
  const accessChat = async (targetUserId) => {
    const data = {
      loggedinUserId: authState.user._id,
      targetUserId: targetUserId,
    };
    const createdChat = await dispatch(accessChatThunk(data));
    navigate(`/chat/${createdChat.payload._id}`);
    setSearchText("");
  };

  const getMsg = (chatData) => {
    navigate(`/chat/${chatData._id}`);
  };

  useEffect(() => {
    dispatch(getChatsThunk(authState.user._id));
  }, []);

  useEffect(() => {
    socket.on("chatUpdated", (chat) => {
      dispatch(upsertChat(chat));
    });

    return () => socket.off("chatUpdated");
  }, []);

  return (
    <div className="sticky top-16 overflow-y-scroll h-[calc(100vh-4rem)]">
      <div className="flex items-center border border-b-gray-300 px-2">
        <SearchIcon className="text-gray-300 text-xl" />
        <input
          type="text"
          placeholder="Search friends to chat..."
          className="w-full py-3 px-1 outline-none border-none text-sm bg-transparent"
          value={searchText}
          onChange={searchFriends}
        />
      </div>
      {userState.followersBySearch.length > 0 && searchText && (
        <div className="absolute top-12 p-2 bg-white shadow-md w-full flex flex-col gap-2">
          {userState.loading.followersBySearch ? (
            <div className="flex justify-center">
              <Spinner size="2rem" color="gray" />
            </div>
          ) : (
            userState?.followersBySearch.map((u) => (
              <div
                className="flex items-center gap-4 cursor-pointer hover:bg-gray-200 p-2"
                key={u._id}
                onClick={() => accessChat(u._id)}
              >
                <img
                  src={u.profileImg?.imgUrl ? u.profileImg.imgUrl : userIcon}
                  alt=""
                  className="h-[2.5rem] w-[2.5rem] object-cover border-2 border-gray-300 rounded-full p-1"
                />
                <p className="text-black">{u.name}</p>
              </div>
            ))
          )}
        </div>
      )}

      <div>
        {chatState.chats?.map((chat) => {
          const otherUser = chat.participants.find(
            (u) => u._id !== authState.user._id
          );
          return (
            <div
              key={chat._id}
              className="flex items-center gap-3 p-3 cursor-pointer border-b border-gray-200 dark:border-gray-500 mt-1 hover:bg-gray-100"
              onClick={() => getMsg(chat)}
            >
              <img
                src={otherUser?.profileImg?.imgUrl || userIcon}
                alt="profile"
                className="h-10 w-10 rounded-full object-cover border"
              />

              <p className="text-sm font-medium">
                {chat.chatName || otherUser?.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
