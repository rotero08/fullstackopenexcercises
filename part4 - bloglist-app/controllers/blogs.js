const blogsRouter = require("express").Router()
const { response } = require("../app")
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const Blog = require("../models/blog")


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1, id: 1})
  await response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) return response.status(404).json({ error: 'No users found' });

  const blog = new Blog({
    ...body,
    user: user.id
  });

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  await response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  await response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  await response.status(200).json(updatedBlog)
})

module.exports = blogsRouter