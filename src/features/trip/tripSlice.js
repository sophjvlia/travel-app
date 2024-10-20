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
    editTrip: (state, action) => { 
      const { id, tripName, tripDestination, dateFrom, dateTo } = action.payload;
      const tripIndex = state.tripList.findIndex((trip) => trip.id === id);

      if (tripIndex !== -1) {
        state.tripList[tripIndex] = {
          ...state.tripList[tripIndex],
          tripName,
          tripDestination,
          dateFrom,
          dateTo,
        };
      }

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
    },
    deleteItinerary: (state, action) => {
      const { tripId, itineraryId } = action.payload;
      const tripIndex = state.tripList.findIndex((trip) => trip.id === tripId);
      if (tripIndex !== -1) {
        const updatedItineraries = state.tripList[tripIndex].itineraries.filter((itinerary) => itinerary.id !== itineraryId);
        const updatedTrip = {
          ...state.tripList[tripIndex],
          itineraries: updatedItineraries
        };
        const updatedTripList = [
          ...state.tripList.slice(0, tripIndex),
          updatedTrip,
          ...state.tripList.slice(tripIndex + 1),
        ];
        state.tripList = updatedTripList;
        localStorage.setItem('trips', JSON.stringify(updatedTripList));
      }
    },
  },
});

export const { addToTrip, editTrip, addToItinerary, editItinerary, deleteTrip, deleteItinerary } = tripSlice.actions;
export default tripSlice.reducer;