import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: {
    token: localStorage.getItem("token") || "",
    isLoggedIn: localStorage.getItem("token") ? true : false,
    orderId:localStorage.getItem("orderId")|| "",
  },
  reducers: {
    // payload :token
    loginAction: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
      state.isLoggedIn = true;
    },

    logoutAction: (state, action) => {
      localStorage.clear();
      state.token = null;
      state.isLoggedIn = false;
    },

    orderAction:(state,action)=>{
      console.log("orderAction",action.payload);
      localStorage.setItem("orderId", action.payload);
      state.orderId = action.payload;      
    }
  },
});
export const { logoutAction, loginAction ,orderAction } = auth.actions;

export default auth.reducer;
