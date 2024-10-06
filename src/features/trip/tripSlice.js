import { createSlice } from '@reduxjs/toolkit'

const tripSlice = createSlice({
  name: 'trip',
  initialState: {
    tripList: JSON.parse(localStorage.getItem('trips')) || [],
  },
  reducers: {
    addToTrip: (state, action) => { 
      state.tripList.push(action.payload);
      localStorage.setItem('trips', JSON.stringify(state.tripList));
    },
    addToItinerary: (state, action) => {
      const { tripId, itinerary } = action.payload;
      const trip = state.tripList.find((trip) => trip.id === tripId);
      if (trip) {
        trip.itineraries = trip.itineraries || [];
        trip.itineraries = [...trip.itineraries, itinerary];
        localStorage.setItem('trips', JSON.stringify(state.tripList));
      }
    },
    editItinerary: (state, action) => {
      const { tripId, itinerary } = action.payload;
      const trip = state.tripList.find((trip) => trip.id === tripId);
      if (trip) {
        const itineraryIndex = trip.itineraries.findIndex(i => i.id === itinerary.id);
        if (itineraryIndex !== -1) {
          trip.itineraries[itineraryIndex] = itinerary;
        }
        localStorage.setItem('trips', JSON.stringify(state.tripList));
      }
    },
    deleteTrip: (state, action) => {
      state.tripList = state.tripList.filter(
        (trip) => trip.id !== action.payload
      );
      localStorage.setItem('trips', JSON.stringify(state.tripList));
    }
  },
});

export const { addToTrip, addToItinerary, editItinerary, deleteTrip } = tripSlice.actions;
export default tripSlice.reducer;