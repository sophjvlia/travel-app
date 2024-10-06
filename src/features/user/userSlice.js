import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: localStorage.getItem('user') ? true : false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('user');
    }
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;