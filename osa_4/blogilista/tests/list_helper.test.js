const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {

  test('of empty list is zero', () => {
    const empty = []

    const result = listHelper.totalLikes(empty)
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    //const likes = Math.floor(Math.random() * 100)
    //const blogs = [{'likes': likes}]
    const blog = blogs[0]
    const likes = blog.likes
    const one_blog = [blog]
    const result = listHelper.totalLikes(one_blog)
    expect(result).toBe(likes)
  })

  test('of a bigger list is calculated right', () => {
    let total = 0
    for (let blog of blogs) {
      total += blog.likes
    }

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(total)
  })

})

describe('favorite blog', () => {

  test('of an empty list is an empty object', () => {

    const empty = {}

    const result = listHelper.favoriteBlog([])
    expect(result).toEqual(empty)
  })

  test('when list has only one blog, return that', () => {

    const randomBlog = blogs[Math.floor(Math.random() * blogs.length)]

    const { _id, url, __v, ...copy } =randomBlog


    const result = listHelper.favoriteBlog([randomBlog])
    expect(result).toEqual(copy)
  })

  test('found from a bigger list', () => {


    let favorite = blogs[0]
    for (let blog of blogs) {
      if (blog.likes > favorite.likes) {
        favorite = blog
      }
    }
    const { _id, url, __v, ...copy } = favorite


    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(copy)
  })


})

describe('most blogs', () => {

  test('of an empty list results in an empty object', () => {


    const answer = {}

    const result = listHelper.mostBlogs([])
    expect(result).toEqual(answer)
  })

  test('when list has only one blog, return its author', () => {

    const randomBlog = blogs[Math.floor(Math.random() * blogs.length)]

    const answer = { author: randomBlog.author, blogs: 1 }

    const result = listHelper.mostBlogs([randomBlog])
    expect(result).toEqual(answer)
  })

  test('found from a bigger list', () => {

    const answer = { author: 'Robert C. Martin', blogs: 3 }


    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual(answer)
  })
})


describe('most likes', () => {

  test('of an empty list results in an empty object', () => {


    const answer = {}

    const result = listHelper.mostLikes([])
    expect(result).toEqual(answer)
  })

  test('when list has only one blog, return its author', () => {

    const randomBlog = blogs[Math.floor(Math.random() * blogs.length)]

    const answer = { author: randomBlog.author, likes: randomBlog.likes }

    const result = listHelper.mostLikes([randomBlog])
    expect(result).toEqual(answer)
  })

  test('found from a bigger list', () => {

    const answer = { author: 'Edsger W. Dijkstra', likes: 17 }


    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual(answer)
  })
})

