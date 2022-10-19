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
  }
})



export const { notify, hideNotification } = notificationSlice.actions

// Tallennan edellisen setTimeout()-tapahtuman tunnuksen reduxin ulkopuolelle,
// moduulin laajuiseen muuttujaan.
// Tämä tapa tuntuu väärältä, mutta reduxin kanssa en osannut lukea tilaan
// tallentamaani arvoa ilman sellaista monimutkaisuutta, jota en uskonut tässä
// haettavan. (Tallennus sujui ongelmitta.)
let id = null

export const setNotification = (content, time) => {
  return dispatch => {
    dispatch(notify(content))
    clearTimeout(id)
    id = setTimeout(() => {
      dispatch(hideNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer
