import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import msgService from "../services/msg_service";

/* async thunks */
export const sendMsgThunk = createAsyncThunk(
  "msg/sendMsg",
  async (data, thunkAPI) => {
    try {
      return await msgService.sendMsg(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.msg || err.response?.data?.msg);
    }
  }
);

export const getMsgsThunk = createAsyncThunk(
  "msg/getMsgs",
  async (data, thunkAPI) => {
    try {
      return await msgService.getMsgs(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.msg || err.response?.data?.msg);
    }
  }
);

/* slice */
const msgSlice = createSlice({
  name: "msg",
  initialState: {
    msg: null,
    msgs: [],
    error: null,
    success: null,
    loading: {
      sendMsg: false,
      getMsgs: false,
    },
  },
  reducers: {
    clrMsgStateMsg: (state) => {
      state.error = null;
      state.success = null;
    },
    appendNewMsg: (state, action) => {
      state.msgs.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      /* sendMsg */
      .addCase(sendMsgThunk.pending, (state) => {
        state.loading.sendMsg = true;
        state.error = null;
      })
      .addCase(sendMsgThunk.fulfilled, (state, action) => {
        state.loading.sendMsg = false;
        state.msg = action.payload;
      })
      .addCase(sendMsgThunk.rejected, (state, action) => {
        state.loading.sendMsg = false;
        state.error = action.payload;
      })

      /* getMsgs */
      .addCase(getMsgsThunk.pending, (state) => {
        state.loading.getMsgs = true;
        state.error = null;
      })
      .addCase(getMsgsThunk.fulfilled, (state, action) => {
        state.loading.getMsgs = false;
        state.msgs = action.payload;
      })
      .addCase(getMsgsThunk.rejected, (state, action) => {
        state.loading.getMsgs = false;
        state.error = action.payload;
      });
  },
});

export const { clrMsgStateMsg, appendNewMsg } = msgSlice.actions;
export default msgSlice.reducer;
