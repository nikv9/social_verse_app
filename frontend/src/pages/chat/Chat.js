import React from "react";
import ChatList from "../../modules/chat/ChatList";
import ChatWindow from "../../modules/chat/ChatWindow";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { chatId } = useParams();

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div
        className={`flex-[1] border-r 
        ${chatId ? "hidden md:block" : "block"}`}
      >
        <ChatList />
      </div>

      <div
        className={`flex-[4] 
        ${chatId ? "block" : "hidden md:block"}`}
      >
        <ChatWindow />
      </div>
    </div>
  );
};

export default Chat;
