import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import authStore from "./auth_store";
import userStore from "./user_store";
import postStore from "./post_store";
import chatStore from "./chat_store";
import msgStore from "./msg_store";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loading"],
};

const persistedAuthReducer = persistReducer(persistConfig, authStore);

export const Store = configureStore({
  reducer: {
    // auth: authStore,
    auth: persistedAuthReducer,
    user: userStore,
    post: postStore,
    chat: chatStore,
    msg: msgStore,
  },
  // avoids non-serializable warnings
  middleware: [thunk],
});

export const persistor = persistStore(Store);
