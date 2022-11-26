import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import { login } from './reducers/loginReducer'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Button, Navbar, Nav } from 'react-bootstrap'

const App = () => {
  const user = useSelector((state) => state.loggedIn)
  const users = useSelector((state) => state.users)
  const blogs = useSelector((state) => state.blogs)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  // Laitoin seuraavassa blogs-muuttujan riippuvuudeksi, koska ohjelmani ei
  // syystä tai toisesta päivittänyt *käyttäjien* blogs-taulukon sisältöä
  // poistaessani tai lisätessäni blogin (poistotoiminto tosin poistui ohjelmasta
  // tehtävän 7.16 myötä.). Siksi muun muassa Users-näkymän kertoma
  // käyttäjien blogien määrä ei päivittynyt ilman sovelluksen uudelleenlataamista
  // (page refresh). Tämä riippuvuuden käyttö on tosin aika raskas ratkaisu, koska se
  // lataa kaikkien käyttäjien tiedot backendin kautta aina kun blogeja lisätään tai poistetaan.
  // Yritin tietenkin muitakin tapoja, mutta törmäsin erinäisiin ongelmiin. Käytin
  // kuitenkin jo useamman tunnin tämän pulman ratkaisuyrityksiin joten
  // tyydyn nyt tähän ratkaisuun. Jos tämä tulisi oikeaan käyttöön
  // jatkaisin kunnes löytäisin ekonomisemman ratkaisun.
  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch, blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(login(user))
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification />

        <LoginForm />
      </div>
    )
  }

  return (
    <Router>
      <div className="container">
        <Notification />
        <Navbar collapseOnSelect expand="sm" bg="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#">
                <Link to="/">blogs</Link>
              </Nav.Link>
              <Nav.Link href="#">
                <Link to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#">{user.name} logged in</Nav.Link>
              <Button variant="outline-dark" type="button" onClick={logout}>
                logout
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <h2>blog app</h2>

        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User users={users} />} />
          <Route path="/blogs/:id" element={<Blog blogs={blogs} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
