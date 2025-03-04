import { createSlice } from "@reduxjs/toolkit";

const ticketSlice = createSlice({
  name: "tickets",
  initialState: [],
  reducers: {
    setTickets: (state, action) => action.payload,
    addTicket: (state, action) => [...state, action.payload],
    updateTicket: (state, action) => {
      return state.map(ticket =>
        ticket._id === action.payload._id ? action.payload : ticket
      );
    },
  },
});

export const { setTickets, addTicket, updateTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
