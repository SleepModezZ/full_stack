import { useState } from 'react'
import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from '../reducers/notificationReducer'
import { login } from '../reducers/loginReducer'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      const message = 'Welcome back, ' + user.name
      dispatch(login(user))
      setUsername('')
      setPassword('')
      dispatch(setNotification({ confirmation: true, message: message }))
    } catch (exception) {
      dispatch(
        setNotification({ confirmation: false, message: 'wrong credentials' })
      )
    }
  }
  return (
    <Form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          id="username"
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
        <Form.Label>password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          id="password"
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button variant="outline-primary" type="submit">
          login
        </Button>
      </Form.Group>
    </Form>
  )
}

export default LoginForm
