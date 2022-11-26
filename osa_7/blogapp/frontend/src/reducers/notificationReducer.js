import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    notify(state, action) {
      return action.payload
    },
    hideNotification() {
      return null
    },
  },
})

export const { notify, hideNotification } = notificationSlice.actions

let id = null

export const setNotification = (content) => {
  return dispatch => {
    dispatch(notify(content))
    clearTimeout(id)
    id = setTimeout(() => {
      dispatch(hideNotification())
    }, 5000)
  }
}

export default notificationSlice.reducer
