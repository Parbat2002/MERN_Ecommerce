import { createSlice,createAsyncThunk} from "@reduxjs/toolkit";
import axios from 'axios';

// Register API
export const register=createAsyncThunk('user/register',async(userData,{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }
         const {data}=await axios.post('/api/v1/register',userData,config)
         console.log('Registration data',data);
         return data 
    }catch(error){
        return rejectWithValue(error.response?.data?.message || 'Registration Failed!')
    }
})
export const login=createAsyncThunk('user/login',async({email,password},{rejectWithValue})=>{
    try{
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
         const {data}=await axios.post('/api/v1/login',{email,password},config)
         console.log('Login data',data);
         return data 
    }catch(error){
        return rejectWithValue(error.response?.data?.message || 'Login Failed!')
    }
})

const userSlice=createSlice({
    name:'user',
    initialState:{
        user:null,
        loading:false,
        error:null,
        success:false,
        isAuthenticated:false
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null;
        },
        removeSuccess:(state)=>{
            state.success=null;
        }
    },
    extraReducers:(builder)=>{
        //Registration
        builder.addCase(register.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload.success;
            state.user=action.payload?.user || null;
            state.isAuthenticated=Boolean(action.payload?.user);
        })
        .addCase(register.rejected,(state,action)=>{
             state.loading=false;
            state.error=action.payload?.message || 'Registration Failed!';
            state.user=null;
            state.isAuthenticated=false;
        })

         //Login
        builder.addCase(login.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading=false;
            state.error=null;
            state.success=action.payload.success;
            state.user=action.payload?.user || null;
            state.isAuthenticated=Boolean(action.payload?.user);
            console.log('User Logged In:', action.payload.user);
            
        })
        .addCase(login.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload?.message || 'Registration Failed!';
            state.user=null;
            state.isAuthenticated=false;
        })
    }
})

export const{removeErrors,removeSuccess}=userSlice.actions;
export default userSlice.reducer;