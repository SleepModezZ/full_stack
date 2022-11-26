const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')


describe('when there is initially some users saved', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    let userObject = new User(helper.initialUsers[0])
    await userObject.save()
    userObject = new User(helper.initialUsers[1])
    await userObject.save()
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')

    expect(response.body).toHaveLength(helper.initialUsers.length)
  })

  describe('viewing a specific user', () => {

    test('the first user is hellas', async () => {
      const response = await api.get('/api/users')

      expect(response.body[0].username).toBe('hellas')
    })

    test('user identifier should be named id', async () => {
      const response = await api.get('/api/users')
      expect(response.body[0].id).toBeDefined()
    })


    test('succeeds with a valid id', async () => {
      const usersAtStart = await helper.usersInDb()

      const userToView = usersAtStart[0]

      const resultUser = await api
        .get(`/api/users/${userToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const processedUserToView = JSON.parse(JSON.stringify(userToView))

      expect(resultUser.body).toEqual(processedUserToView)
    })

  })

  describe('addition of a new user', () => {

    test('a valid user can be added ', async () => {
      const newUser =   {
        'username': 'testi',
        'name': 'Testi Testinen',
        'password': 'testitesti'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1)

      const usernames = usersAtEnd.map(n => n.username)

      expect(usernames).toContain(
        'testi'
      )
    })


    test('user with too short (less than 3 characters) username is not added', async () => {
      const newUser =   {
        'username': 'te',
        'name': 'Testi Testinen',
        'password': 'testitesti'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const response = await api.get('/api/users')

      expect(response.body).toHaveLength(helper.initialUsers.length)
    })

    test('user with too short (less than 3 characters) password is not added', async () => {
      const newUser =   {
        'username': 'testi',
        'name': 'Testi Testinen',
        'password': 'te'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const response = await api.get('/api/users')

      expect(response.body).toHaveLength(helper.initialUsers.length)
    })

    test('user with a username that already exists in database is not added', async () => {
      const newUser =   {
        'username': 'hellas',
        'name': 'Testi Testinen',
        'password': 'testi'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      const response = await api.get('/api/users')

      expect(response.body).toHaveLength(helper.initialUsers.length)
    })
  })

})



afterAll(() => {
  mongoose.connection.close()
})
