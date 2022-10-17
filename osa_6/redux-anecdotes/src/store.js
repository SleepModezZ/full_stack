import { configureStore } from '@reduxjs/toolkit'
//import anecdoteService from './services/anecdotes'
//import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer'
import anecdoteReducer from './reducers/anecdoteReducer'
//import initializeAnecdotes from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
    filter: filterReducer
  }
})


//store.dispatch(initializeAnecdotes())


export default store
