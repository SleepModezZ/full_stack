const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
]

const initialUsers = [
  {
    "username": "hellas",
    "name": "Arto Hellas",
    "password": "salaisuus"
  },
  {
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "password": "secret"
  },
]

const nonExistingId = async () => {
  const bolog = new Blog({ title: 'willremovethissoon', date: new Date() })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialBlogs,  blogsInDb, nonExistingId, initialUsers, usersInDb
}