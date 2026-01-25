import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../services/chat_service";

/* async thunks */
export const accessChatThunk = createAsyncThunk(
  "chat/accessChat",
  async (data, thunkAPI) => {
    try {
      return await chatService.accessChat(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.msg || err.response?.data?.msg);
    }
  }
);

export const getChatsThunk = createAsyncThunk(
  "chat/getChats",
  async (data, thunkAPI) => {
    try {
      return await chatService.getChats(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.msg || err.response?.data?.msg);
    }
  }
);

export const deleteChatThunk = createAsyncThunk(
  "chat/deleteChatForMe",
  async ({ chatId, loggedinUserId }, thunkAPI) => {
    try {
      await chatService.deleteChat(chatId, loggedinUserId);
      return chatId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.msg);
    }
  }
);

/* slice */
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chat: null,
    chats: [],
    error: null,
    success: null,
    loading: {
      accessChat: false,
      getChats: false,
    },
  },
  reducers: {
    clrChatStateMsg: (state) => {
      state.error = null;
      state.success = null;
    },
    upsertChat: (state, action) => {
      const chat = action.payload;

      const index = state.chats.findIndex((c) => c._id === chat._id);

      if (index !== -1) {
        state.chats[index] = chat;
      } else {
        state.chats.unshift(chat);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // accessChat
      .addCase(accessChatThunk.pending, (state) => {
        state.loading.accessChat = true;
        state.error = null;
      })
      .addCase(accessChatThunk.fulfilled, (state, action) => {
        state.loading.accessChat = false;
        state.chat = action.payload;
      })
      .addCase(accessChatThunk.rejected, (state, action) => {
        state.loading.accessChat = false;
        state.error = action.payload;
      })

      // getChats
      .addCase(getChatsThunk.pending, (state) => {
        state.loading.getChats = true;
        state.error = null;
      })
      .addCase(getChatsThunk.fulfilled, (state, action) => {
        state.loading.getChats = false;
        state.chats = action.payload;
      })
      .addCase(getChatsThunk.rejected, (state, action) => {
        state.loading.getChats = false;
        state.error = action.payload;
      })

      // delete chat
      .addCase(deleteChatThunk.pending, (state) => {
        state.loading.deleteChat = true;
      })
      .addCase(deleteChatThunk.fulfilled, (state, action) => {
        state.loading.deleteChat = false;
        state.chats = state.chats.filter((c) => c._id !== action.payload);
        state.chat = null;
      })
      .addCase(deleteChatThunk.rejected, (state, action) => {
        state.loading.deleteChat = false;
        state.error = action.payload;
      });
  },
});

export const { clrChatStateMsg, upsertChat } = chatSlice.actions;
export default chatSlice.reducer;
