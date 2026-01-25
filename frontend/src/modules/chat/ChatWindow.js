import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket/socket";
import { sendMsgThunk, getMsgsThunk } from "../../redux/msg_store";
import { useNavigate, useParams } from "react-router-dom";
import { deleteChatThunk } from "../../redux/chat_store";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Menu, MenuItem } from "@mui/material";

const ChatWindow = () => {
  const chatContainerRef = useRef(null);

  const authState = useSelector((state) => state.auth);
  const chatState = useSelector((state) => state.chat);
  const msgState = useSelector((state) => state.msg);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);

  const params = useParams();

  useEffect(() => {
    if (!params.chatId) return;

    dispatch(getMsgsThunk(params.chatId));
    socket.emit("joinRoom", params.chatId);

    // When message is received via socket
    socket.on("receiveMsg", (message) => {
      // Only append if the message is for the current chat
      if (message.chat === params.chatId) {
        dispatch({ type: "msg/appendNewMsg", payload: message });
      }
    });

    return () => {
      socket.off("receiveMsg");
    };
  }, [params.chatId, dispatch]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      content: newMessage,
      chatId: params.chatId,
      loggedinUserId: authState.user._id,
    };

    const createdMsg = await dispatch(sendMsgThunk(messageData));

    // Emit the new message to others
    socket.emit("sendMsg", {
      roomId: params.chatId,
      message: createdMsg,
    });

    setNewMessage("");
  };

  useEffect(() => {
    if (!chatContainerRef?.current) return;

    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [msgState.msgs]);

  const openMenu = (e) => {
    setMenuAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const deleteChat = async () => {
    closeMenu();
    await dispatch(
      deleteChatThunk({
        chatId: params.chatId,
        loggedinUserId: authState.user._id,
      })
    );
    navigate("/chat");
  };

  if (!params.chatId) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col justify-center items-center">
        <h2 className="text-lg font-semibold mb-2">No Chat Selected</h2>
        <p className="text-sm">Start or select a chat to begin messaging.</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()}>←</button>

          <h2 className="text-lg font-semibold">
            {chatState.chats?.find((c) => c._id === params.chatId)?.chatName ||
              chatState.chats
                ?.find((c) => c._id === params.chatId)
                ?.participants.find((u) => u._id !== authState.user._id)
                ?.name ||
              "Chat"}
          </h2>
        </div>

        <button onClick={openMenu}>
          <MoreVertIcon />
        </button>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          <MenuItem onClick={deleteChat} className="text-red-500">
            Delete chat
          </MenuItem>
        </Menu>
      </div>

      {/* Chat messages display */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
        {msgState.loading.getMsgs ? (
          <div className="text-center text-gray-500 mt-4">Loading...</div>
        ) : (
          msgState?.msgs?.map((message) => {
            const isSender = message.sender._id === authState.user._id;

            return (
              <div
                key={message._id}
                className={`mb-2 flex ${
                  isSender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg shadow-sm ${
                    isSender
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-black rounded-bl-none"
                  }`}
                >
                  <div className="text-xs font-semibold mb-1 flex justify-between">
                    <span>{message.sender.name}</span>
                    <span className="ml-2 text-[0.7rem] text-gray-500">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="text-sm break-words whitespace-pre-line">
                    {message.content}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Input */}
      <div className="shadow-md flex items-center p-4 border-t">
        <textarea
          placeholder="Type a message"
          className="flex-1 p-2 rounded-md outline-none resize-none h-16 bg-transparent"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <button
          className="ml-4 bg-blue-600 text-white px-4 py-1.5 rounded-sm"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
