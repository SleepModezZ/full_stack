//import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import  { useField } from '../hooks'

const CreateNew = ({ anecdotes, setAnecdotes, setNotification }) => {
  // Tehtävän 7.6 olisi voinut ratkaista myös nimeämällä useFieldin reset onReset:iksi, mutta oletan,
  // että tässä käyttämääni ratkaisua etsittiin. Molemmat ratkaisut muuten löytyivät osoitteesta
  // https://stackoverflow.com/questions/73930529/invalid-value-for-prop-reset-on-input-tag,
  // jossa on selvästikin annettu vastaus juuri tähän tehtävään. Törmäsin vastaukseen,
  // vaikka googlasinkin apua yleisemmällä virheilmoituksella, jossa en maininnut sanaa 'reset'.
  const { reset: resetContent, ...content } = useField('content')
  const{ reset: resetAuthor, ...author } = useField('author')
  const { reset: resetInfo, ...info } = useField('info')

  const navigate = useNavigate()

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification('a new anecdote ' + anecdote.content + ' created!')
    setTimeout(() => {
      setNotification('')
    }, 5000)
    navigate("/")
  }

  const handleSubmit = (e) => {
    const anecdote = {}
    anecdote.content = content.value
    anecdote.author = author.value
    anecdote.info = info.value
    anecdote.votes = 0
    addNew(anecdote)
  }

  const reset = (e) => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

    return (
    <div>
      <h2>create a new anecdote</h2>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button onClick={handleSubmit}>create</button>
        <button onClick={reset}>reset</button>
    </div>
  )

}

export default CreateNew

