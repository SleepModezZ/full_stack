import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { GENRES, ALL_AUTHORS, CREATE_BOOK } from '../queries.js'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  // Tyhjensin tässä ensin kirjojen välimuistin, mutta päädyin tekemään saman subscription-
  // toiminnallisuuden toteutuksessa. Poistin sen siis tarpeettomana tästä. Jätän kuitenkin
  // ulos-kommnetoidun version, jos jonkin tehtävän suoritus edellyttää näytettä, että
  // välimuistin hallinta on toteutettu uuden kirjan lisäykseen käytettävän lomakkeen yhteydessä:
  // const [addBook] = useMutation(CREATE_BOOK, {
  //   refetchQueries: [{ query: ALL_AUTHORS }, { query: GENRES }],
  //   update(cache) {
  //     cache.evict({ id: 'ROOT_QUERY', fieldName: 'allBooks' })
  //   },
  // })
  //
  // Olisi ehkä ollut parempi välimuistin tyhjennyksen sijaan päivittää välimuisti, mutta
  // suoraan sanottuna, minulle oli vaikeuksia saada se toteutettua, vaikka käytin siihen
  // aikaa lukuisia tunteja. Ymmärrykseni lisäksi parannettavaa saattaisi olla myös
  // apollographql:n dokumnetaatiossa.
  //
  // Vaikeudet saattoivat johtua esimerkiksi siitä, että en käytä kyselyä ALL_BOOKS
  // lainkaan, vaan kyselyä BOOKS_BY_GENRE (tein näin siinä vaiheessa kun genre-rajaukset
  // tuli tehdä serverin puolella eikä asiakasohjelmassa). Saan listan kaikista kirjoista myös
  // kyselyllä BOOKS_BY_GENRE kunhan annan argumentiksi tyhjän merkkijonon.
  //  Sain mielestäni kirjojen listauksen mielestäni toteutettua yksinkertaisemmin näin.
  // Huonona puolena toteutuksessani on tietenkin, että välimuistin tyhjentelyn
  // seuraksena tiedot ladataan tarpeettoman usein serveriltä. Ne ladataan (potentiaalisesti)
  // tuhansille) käyttäjille aina kun yksikin käyttäjistä lisää uuden kirjan.

  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: GENRES }],
  })

  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const year = parseInt(published)
    addBook({
      variables: { title, year, author, genres },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
