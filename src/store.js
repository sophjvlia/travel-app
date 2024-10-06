import { configureStore } from '@reduxjs/toolkit'
import tripReducer from './features/trip/tripSlice'
import userReducer from './features/user/userSlice'

const store = configureStore({
  reducer: {
    trip: tripReducer,
    user: userReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('trip', JSON.stringify(state.trip.tripList));
});

export { store };