import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: JSON.parse(localStorage.getItem("user"))?.userId || null,
  role: JSON.parse(localStorage.getItem("user"))?.role || null,
  examId: null,
  isCompleted: false,
  obtainedScore: 0,
  totalScore: 0,
  examDetails: { subjectNames: [], topicNames: [] },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setUserRole: (state, action) => {
      state.role = action.payload;
    },
    setExamId: (state, action) => {
      state.examId = action.payload;
    },
    setIsCompleted: (state, action) => {
      state.isCompleted = action.payload;
    },
    setScores: (state, action) => {
      state.obtainedScore = action.payload.obtainedScore;
      state.totalScore = action.payload.totalScore;
    },
    setExamDetails(state, action) {
      state.examDetails = action.payload;
    },
  },
});

export const {
  setUserId,
  setUserRole,
  setExamId,
  setIsCompleted,
  setScores,
  setExamDetails,
} = userSlice.actions;
export default userSlice.reducer;
