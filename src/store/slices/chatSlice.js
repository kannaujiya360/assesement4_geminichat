
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chatrooms: JSON.parse(localStorage.getItem('chatrooms')) || [],
  activeChatroomId: null,
  messages: JSON.parse(localStorage.getItem('messages')) || {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatrooms(state, action) {
      state.chatrooms = action.payload;
      localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
    },
    addChatroom(state, action) {
      state.chatrooms.push(action.payload);
      localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
    },
    deleteChatroom(state, action) {
      state.chatrooms = state.chatrooms.filter(c => c.id !== action.payload);
      delete state.messages[action.payload];
      localStorage.setItem('chatrooms', JSON.stringify(state.chatrooms));
      localStorage.setItem('messages', JSON.stringify(state.messages));
    },
    setActiveChatroom(state, action) {
      state.activeChatroomId = action.payload;
    },
    addMessage(state, action) {
      const { chatroomId, message } = action.payload;
      if (!state.messages[chatroomId]) {
        state.messages[chatroomId] = [];
      }
      state.messages[chatroomId].push(message);
      localStorage.setItem('messages', JSON.stringify(state.messages));
    },
  },
});

export const {
  setChatrooms,
  addChatroom,
  deleteChatroom,
  setActiveChatroom,
  addMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
