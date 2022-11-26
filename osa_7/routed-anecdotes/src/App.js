import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from "react-router-dom"
import AnecdoteList from './components/AnecdoteList.js'
import CreateNew from './components/CreateNew.js'
import About from './components/About.js'
import Anecdote from './components/Anecdote.js'
import Notification from './components/Notification.js'

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')


  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
  const padding = {
    paddingRight: 5
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Router>
        <div>
          <Link style={padding} to="/">anecdotes</Link>
          <Link style={padding} to="/create">create new</Link>
          <Link style={padding} to="/about">about</Link>
        </div>
        <Notification notification={notification}/>
        <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
          <Route path="/create" element={<CreateNew anecdotes={anecdotes}
            setAnecdotes={setAnecdotes} setNotification={setNotification} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  )
}

export default App
