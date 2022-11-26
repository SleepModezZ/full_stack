import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Like from './Like'
import { addComment } from '../reducers/blogReducer'
import { Form, Button } from 'react-bootstrap'

const Blog = ({ blogs }) => {
  const id = useParams().id
  const [commentString, setCommentString] = useState('')
  const dispatch = useDispatch()

  // Kurssimateriaalissa ehdon jälkimmäinen kohta oli Number(id),
  // mutta minulla on id:t tässä ohjelmassa stringinä:
  const blog = blogs.find((n) => n.id === id)
  if (blog === undefined) {
    return null
  }

  const comment = async (event) => {
    event.preventDefault()

    console.log(commentString)

    dispatch(addComment(blog.id, commentString))
    setCommentString('')
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={'https://' + blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>
      <br />
      <Like blog={blog} />
      added by {blog.user.name}
      <br />
      <h3>comments</h3>
      <Form onSubmit={comment}>
        <Form.Group>
          <Form.Control
            type="text"
            value={commentString}
            id="comment"
            name="comment"
            onChange={({ target }) => setCommentString(target.value)}
          />
          <Button variant="outline-success" id="comment-button" type="submit">
            add comment
          </Button>
        </Form.Group>
      </Form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Blog
