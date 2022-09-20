const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog.toJSON())
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user =  request.user


  if (body.title && body.url) {
    const blog = new Blog({
      author: body.author,
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(blog)
  } else {
    response.status(400).json({ error: 'blog must have title and url' })
  }

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (user.id !== blog.user.toString()) {
    return response.status(403).json({ error: 'user does not have permission to delete the resource' })
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// Tehtävissä ei nähdäkseni vaadittu oikeuksien tarkistuksia, mutta lisäsin ne tähänkin:
blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (user.id !== blog.user.toString()) {
    return response.status(403).json({ error: 'user does not have permission to update the resource' })
  }

  const updatedBlog = {
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes,
  }

  // Laitoin onnistuneen päivittämisen status-koodiksi 200:
  const update = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true })
  return response.status(200).json(update)
})


module.exports = blogsRouter
