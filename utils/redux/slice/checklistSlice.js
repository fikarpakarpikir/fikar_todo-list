import api from "@/lib/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchChecklist = createAsyncThunk("checklist", async () => {
	const response = await api.get("/checklist");

	return response.data?.data;
});

const checklistSlice = createSlice({
	name: "checklist",
	initialState: {
		checklists: [],
		loadingChecklist: false,
	},
	reducers: {
		checklistReducer: (state, action) => {
			state.checklists = action.payload;
		},
		checklistAdd: (state, action) => {
			const payload = Array.isArray(action.payload)
				? action.payload
				: [action.payload];

			state.checklists.unshift(...payload);
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchChecklist.pending, (state) => {
			state.loadingChecklist = true;
		});
		builder.addCase(fetchChecklist.fulfilled, (state, action) => {
			state.checklists = action.payload;

			state.loadingChecklist = false;
		});
		builder.addCase(fetchChecklist.rejected, (state) => {
			state.loadingChecklist = false;
		});
	},
});

export const { checklistReducer, checklistAdd } = checklistSlice.actions;

export default checklistSlice.reducer;
