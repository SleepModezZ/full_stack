import { useState } from 'react'
import blogService from '../services/blogs'

const BlogForm = ({ user, blogs, setBlogs, setConfirmationMessage, setErrorMessage, testFunction }) => {
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
      user: user.id,
    }

    // Vain testausta varten (tehtävä 5.16)
    if (testFunction) {
      testFunction(blogObject)
      return
    }

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      const message = 'a new blog ' + newTitle + ' by ' + newAuthor + ' added'
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      setConfirmationMessage(message)
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      // Olisi ehkä parempi, jos saisi näkyviin serverin palauttaman virheviestin,
      // mutta en nyt ala sitä yrittämään (järkevintä olisi tehdä tarkistukset jo
      // asiakkaan puolella). Näytän siksi vain viestin virheen statuskoodista.
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    setBlogFormVisible(false)
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
        <button onClick={() => setBlogFormVisible(true)}>new blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={addBlog}>
          <div>title: <input id='title' value={newTitle} onChange={handleTitleChange} /></div>
          <div>author: <input id='author' value={newAuthor} onChange={handleAuthorChange} /></div>
          <div>url: <input id='url' value={newUrl} onChange={handleUrlChange} /></div>
          <div>
            <button id='create' type="submit">create</button>
          </div>
        </form>
        <button onClick={() => setBlogFormVisible(false)}>cancel</button>
      </div>
    </div>
  )
}

export default BlogForm
