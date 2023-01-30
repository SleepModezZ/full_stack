import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries.js'

const Recommended = (props) => {
  const allBooks = useQuery(ALL_BOOKS)
  const genre = useQuery(ME)

  if (!props.show || !allBooks.data || !genre) {
    return null
  }

  const books = allBooks.data.allBooks.filter((b) =>
    b.genres.includes(genre.data.me.favoriteGenre)
  )

  return (
    <div>
      <h2>recommendations</h2>
      books in your favorite genre <b>{genre.data.me.favoriteGenre}</b>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
