const blogsRouter = require("express").Router()
const { response } = require("../app")
const Blog = require("../models/blog")

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  await response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  await response.status(201).json(result)
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