import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    update(state, action) {
      const updatedBlog = action.payload
      return state
        .map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
        .sort((a, b) => b.likes - a.likes)
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload.sort((a, b) => b.likes - a.likes)
    },
    remove(state, action) {
      return state.filter(blog => blog.id !== action.payload)
    },
  },
})

export const { update, appendBlog, setBlogs, remove } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content)
    dispatch(appendBlog(newBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id)
    dispatch(remove(id))
  }
}

export const addLike = (id) => {
  return async (dispatch) => {
    const blog = await blogService.get(id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    const result = await blogService.update(id, changedBlog)
    dispatch(update(result))
  }
}

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const result = await blogService.addComment(id, comment)
    dispatch(update(result))
  }
}

export default blogSlice.reducer
