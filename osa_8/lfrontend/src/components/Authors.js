import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries.js'

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!props.show || !authors.data) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

    const year = parseInt(born)
    editAuthor({
      variables: { name, year },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <select
          defaultValue={'DEFAULT'}
          style={{ width: '187px' }}
          onChange={({ target }) => setName(target.value)}
        >
          <option value="DEFAULT" disabled>
            Select author ...
          </option>
          {authors.data.allAuthors.map((a) => (
            <option value={a.name} key={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          born
          <input
            style={{ width: '150px' }}
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
