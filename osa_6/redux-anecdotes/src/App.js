import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'


const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    //console.log(initializeAnecdotes)
    //console.log(initializeAnecdotes())
    dispatch(initializeAnecdotes())
  }, [dispatch])


  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
