import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { processStateReducer } from "./slice/processStateSlice";

const processReducer = combineReducers({
	default: processStateReducer,
});

const store = configureStore({
	reducer: {
		process: processReducer,
	},
});

store.subscribe(() => store.getState());

export default store;
