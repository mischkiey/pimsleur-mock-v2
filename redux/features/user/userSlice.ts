import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface SigninArgs {
  email: string;
  password: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {},
});

export default userSlice.reducer;
