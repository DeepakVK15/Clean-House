import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

import currentTimeReducer from "./currentTime";

export default configureStore({
  reducer: {
    currentTime: currentTimeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
