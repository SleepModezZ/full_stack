const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let loginToken = '' //Globaalimuuttuja heh heh


beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  blogObject.user = user.id
  user.blogs = user.blogs.concat(blogObject._id)
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  blogObject.user = user.id
  user.blogs = user.blogs.concat(blogObject._id)
  await blogObject.save()
  await user.save()

  // Autentikointi:
  let info = await api.post('/api/login')
    .send({ 'username': 'root', 'password': 'sekret' })
  loginToken = 'Bearer ' + info.body.token

})

describe('when there is initially some blogs saved', () => {

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  describe('viewing a specific blog', () => {

    test('the first blog is about React patterns', async () => {
      const response = await api.get('/api/blogs')

      expect(response.body[0].title).toBe('React patterns')
    })

    test('blog identifier should be named id', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[0].id).toBeDefined()
    })


    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

      expect(resultBlog.body).toEqual(processedBlogToView)
    })

  })

  describe('addition of a new blog', () => {

    test('a valid blog can be added ', async () => {
      const newBlog =   {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set({ username: 'root', authorization: loginToken  })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(n => n.title)

      expect(titles).toContain(
        'Type wars'
      )
    })

    test('when not specified, likes should be set to 0', async () => {
      const newBlog =   {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      }

      await api
        .post('/api/blogs')
        .set({ username: 'root', authorization: loginToken  })
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      const blog = blogsAtEnd.filter(n => n.title === 'Type wars')[0]
      expect(blog.likes).toBeDefined()
      expect(blog.likes).toBe(0)
    })

    test('blog without title and url is not added', async () => {
      const newBlog =   {
        author: 'Robert C. Martin',
        likes: 1000
      }

      await api
        .post('/api/blogs')
        .set({ username: 'root', authorization: loginToken  })
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs')

      expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('unauthorized user cannot add a blog', async () => {
      const newBlog =   {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

      const titles = blogsAtEnd.map(n => n.title)

      expect(titles).not.toContain(
        'Type wars'
      )
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ username: 'root', authorization: loginToken  })
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContain(blogToDelete.title)
    })

    test('unauthorized deletion should fail', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).toContain(blogToDelete.title)
    })

    test('cannot delete other user\'s postings', async () => {
      const passwordHash = await bcrypt.hash('sekret2', 10)
      const user = new User({ username: 'new_user', passwordHash })
      await user.save()

      // kirjaudutaan:
      let returned = await api.post('/api/login')
        .send({ 'username': 'new_user', 'password': 'sekret2' }).expect(200)
      const newLoginToken = 'Bearer ' + returned.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({ username: 'new_user', authorization: newLoginToken  })
        .expect(403)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).toContain(blogToDelete.title)
    })
  })

  // Päivittämisen yhteydessä ei nähdäkseni pyydetty käyttämään autentikointia, mutta koska
  // sen tulin lisänneeksi, olen kirjoittanut seuraavat testit sen mukaisesti:
  describe('updating a blog', () => {
    test('succeeds to update a blog', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const oldLikes = blogToUpdate.likes

      const updatedBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({ username: 'root', authorization: loginToken  })
        .send(updatedBlog)
        .expect(200)

      const result = await api
        .get(`/api/blogs/${blogToUpdate.id}`)

      // Tarkistetaan, että likes-arvon kasvattaminen yhdellä onnistui:
      expect(result.body.likes).toEqual(oldLikes + 1)
    })



    test('unauthorized updating should fail', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const oldLikes = blogToUpdate.likes

      const updatedBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(401)

      const result = await api
        .get(`/api/blogs/${blogToUpdate.id}`)

      // Tarkistetaan, että likes-arvon kasvattaminen yhdellä ei onnistunut:
      expect(result.body.likes).toEqual(oldLikes)
    })

    test('cannot update other user\'s postings', async () => {

      const passwordHash = await bcrypt.hash('sekret2', 10)
      const user = new User({ username: 'new_user', passwordHash })
      await user.save()

      // kirjaudutaan:
      let returned = await api.post('/api/login')
        .send({ 'username': 'new_user', 'password': 'sekret2' }).expect(200)
      const newLoginToken = 'Bearer ' + returned.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      const oldLikes = blogToUpdate.likes

      const updatedBlog = {
        author: blogToUpdate.author,
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({ username: 'new_user', authorization: newLoginToken  })
        .send(updatedBlog)
        .expect(403)

      const result = await api
        .get(`/api/blogs/${blogToUpdate.id}`)

      // Tarkistetaan, että likes-arvon kasvattaminen yhdellä ei onnistunut:
      expect(result.body.likes).toEqual(oldLikes)
    })
  })
})



afterAll(async () => {
  mongoose.connection.close()
})
