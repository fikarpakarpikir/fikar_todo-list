import { createSlice } from "@reduxjs/toolkit";

const processStateSlice = createSlice({
	name: "processState",
	initialState: {
		processState: false,
		processMessageFailed: "",
		processMessage: "",
		toastState: false,
	},
	reducers: {
		processCloseAllReducer: (state, action) => {
			state.processState = false;
			state.toastState = false;
		},
		processStateReducer: (state, action) => {
			state.processState = action.payload;
		},
		toastStateReducer: (state, action) => {
			state.toastState = action.payload;
		},
		toastCloseReducer: (state, action) => {
			state.toastState = false;
		},
		processMessageFailedReducer: (state, action) => {
			state.processMessageFailed = action.payload;
		},
		processMessageReducer: (state, action) => {
			state.processMessage = action.payload;
		},
	},
});

export const {
	processCloseAllReducer,
	processStateReducer,
	processMessageFailedReducer,
	processMessageReducer,
	toastStateReducer,
	toastCloseReducer,
} = processStateSlice.actions;

export default processStateSlice.reducer;
