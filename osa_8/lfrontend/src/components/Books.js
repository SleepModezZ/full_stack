import { useQuery } from '@apollo/client'
import { BOOKS_BY_GENRE, GENRES } from '../queries.js'
import { useState } from 'react'

const DisplayGenre = ({ genre }) => {
  if (genre === '') {
    return <>all books</>
  }

  return (
    <>
      in genre <b>{genre}</b>
    </>
  )
}

const Books = (props) => {
  const [genre, setGenre] = useState('')
  const genres = useQuery(GENRES)
  const gbooks = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
  })

  const filter = (g) => {
    setGenre(g)
  }

  if (!props.show || !gbooks.data || !genres.data) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <DisplayGenre genre={genre} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {gbooks.data.allBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.data.genres.map((g) => (
          <button key={g} onClick={() => filter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => filter('')}>all genres</button>
      </div>
    </div>
  )
}

export default Books
