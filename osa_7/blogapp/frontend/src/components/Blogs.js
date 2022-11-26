import { useSelector } from 'react-redux'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import Table from 'react-bootstrap/Table'

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.loggedIn)

  return (
    <div>
      <BlogForm user={user} />
      <Table striped>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>
                <Link to={'/blogs/' + blog.id}>
                  {blog.title} {blog.author}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Blogs
