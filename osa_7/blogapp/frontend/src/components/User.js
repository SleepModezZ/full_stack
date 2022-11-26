// import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const User = ({ users }) => {
  const id = useParams().id
  // Kurssimateriaalissa ehdon jälkimmäinen kohta oli Number(id),
  // mutta minulla on id:t tässä ohjelmassa stringinä.
  const user = users.find((n) => n.id === id)
  if (user === undefined) {
    return null
  }
  return (
    <div>
      <h2>{user.name}</h2>
      <p>added blogs</p>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
