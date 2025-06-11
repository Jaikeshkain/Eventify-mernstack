import { LogoutAPI } from "@/services/UserService";
import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"auth",
    initialState:{
        user:localStorage.getItem("USER_INFO")?JSON.parse(localStorage.getItem("USER_INFO")!):null
    },

    reducers:{
        loginAction:(state,action)=>{
            state.user=action.payload;
        },
        logoutAction:(state,action)=>{
            state.user=null;
            localStorage.removeItem("USER_INFO");
        },
    }
})

export const {loginAction,logoutAction}=authSlice.actions;
export default authSlice.reducer;
