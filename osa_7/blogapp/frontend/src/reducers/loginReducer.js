import { createSlice } from '@reduxjs/toolkit'
// import userService from '../services/users'

const loginSlice = createSlice({
  name: 'loggedIn',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = loginSlice.actions

export const login = (user) => {
  return async (dispatch) => {
    dispatch(setUser(user))
  }
}

export default loginSlice.reducer