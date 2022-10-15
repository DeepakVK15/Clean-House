import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import "moment-timezone";
export const currentTimeSlice = createSlice({
  name: "currentTime",
  initialState: {
    time: moment().tz("America/Los_Angeles").format(),
  },
  reducers: {
    setTime: (state, action) => {
      if (action.payload) {
        state.time = action.payload.tz("America/Los_Angeles").format();
      }

      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTime } = currentTimeSlice.actions;

export default currentTimeSlice.reducer;
