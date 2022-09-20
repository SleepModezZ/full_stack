import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import compareLikes from './services/compareLikes'


const App = () => {
  const [blogs, setBlogs] = useState([])

  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(compareLikes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      const message = 'Welcome back, ' + user.name
      setUser(user)
      setUsername('')
      setPassword('')
      setConfirmationMessage(message)
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }



  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }


  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification errorMessage={errorMessage} confirmationMessage={confirmationMessage} />

        <LoginForm handleLogin={handleLogin} username={username} setUsername={setUsername}
          password={password} setPassword={setPassword}></LoginForm>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification errorMessage={errorMessage} confirmationMessage={confirmationMessage} />

      <p>{user.name} logged in <button type="button" onClick={logout} >logout</button></p>
      <BlogForm user={user} blogs={blogs} setBlogs={setBlogs}
        setConfirmationMessage={setConfirmationMessage} setErrorMessage={setErrorMessage} />

      {blogs.map(blog =>
        <Blog key={blog.id} user={user} blog={blog} blogs={blogs} setBlogs={setBlogs}
          setErrorMessage={setErrorMessage} setConfirmationMessage={setConfirmationMessage}/>
      )}
    </div>
  )
}

export default App
