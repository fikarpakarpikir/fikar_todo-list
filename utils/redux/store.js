import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { processStateReducer } from "./slice/processStateSlice";
import checklistSlice from "./slice/checklistSlice";

const processReducer = combineReducers({
	default: processStateReducer,
});

const store = configureStore({
	reducer: {
		process: processReducer,
		checklist: checklistSlice,
	},
});

store.subscribe(() => store.getState());

export default store;
