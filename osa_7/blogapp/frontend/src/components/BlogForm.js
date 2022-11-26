import { useState } from 'react'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'
import { Form, Button } from 'react-bootstrap'

const BlogForm = (props) => {
  const [blogFormVisible, setBlogFormVisible] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      user: props.user.id,
    }
    try {
      await props.createBlog(blogObject)
      const message = 'a new blog ' + newTitle + ' by ' + newAuthor + ' added'
      console.log('BlogF0rm: ' + JSON.stringify(blogObject.user))
      props.setNotification({ confirmation: true, message: message })
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
    } catch (exception) {
      props.setNotification({ confirmation: false, message: exception.message })
    }
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' }
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' }
  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          variant="outline-success"
          onClick={() => setBlogFormVisible(true)}
        >
          new blog
        </Button>
      </div>
      <div style={showWhenVisible}>
        <Form onSubmit={addBlog}>
          <Form.Group>
            <Form.Label>title:</Form.Label>
            <Form.Control
              type="text"
              id="title"
              value={newTitle}
              onChange={handleTitleChange}
            />
            <Form.Label>author:</Form.Label>
            <Form.Control
              type="text"
              id="author"
              value={newAuthor}
              onChange={handleAuthorChange}
            />
            <Form.Label>url:</Form.Label>
            <Form.Control
              type="text"
              input
              id="url"
              value={newUrl}
              onChange={handleUrlChange}
            />
            <Button variant="outline-primary" type="submit">
              create
            </Button>
            <Button
              variant="outline-secondary m-2"
              onClick={() => setBlogFormVisible(false)}
            >
              cancel
            </Button>
          </Form.Group>
        </Form>
      </div>
    </div>
  )
}

const mapDispatchToProps = {
  createBlog,
  setNotification,
}

export default connect(null, mapDispatchToProps)(BlogForm)
