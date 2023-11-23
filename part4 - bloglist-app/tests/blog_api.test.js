const mongoose = require('mongoose')
const helper = require("./test_helper")
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

const api = supertest(app)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blogs unique identifier is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogObjets = response.body
    const promiseArray = blogObjets.map(blog => expect(blog.id).toBeDefined())
    await Promise.all(promiseArray)
})

afterAll(async () => {
  await mongoose.connection.close()
})