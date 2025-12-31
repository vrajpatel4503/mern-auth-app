import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/index.js";
import authReducer from "./authSlice.js";

// step 1 : Configure Redux Persist
const persistConfig = {
  key: "track-app",
  storage,
};

// step 2 : combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);


// authReducer is just the name you're giving to authSlice.reducer when importing it.


