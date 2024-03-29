const mongoose = require('mongoose')
const helper = require("./test_helper")
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const User = require('../models/user')
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

    const blogObjects = response.body
    const promiseArray = blogObjects.map(blog => expect(blog.id).toBeDefined())
    await Promise.all(promiseArray)
})

test('blogs are successfully created and increased by one', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(contents).toContain(
    'Type wars'
  )
})

test('blogs without likes have 0 likes by default', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        __v: 0
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const createdBlog = response.body.find(blog => blog.id==="5a422bc61b54a676234d17fc")

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
    expect(createdBlog.likes).toEqual(0)
})

test('blogs without title or url outputs bad request', async () => {
    const newBlog = {
        _id: "5a422bc61b54a676234d17fc",
        author: "Robert C. Martin",
        likes: 2,
        __v: 0
    }
    
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('blogs are deleted successfully', async () => {
    await api
        .delete('/api/blogs/5a422b891b54a676234d17fa')
        .expect(204)
})

test('blogs are updated successfully', async () => {
    const updateBlog = {
        likes: 131,
    }

    await api
        .put('/api/blogs/5a422b891b54a676234d17fa')
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const response = await api.get('/api/blogs')
    const updatedBlog = response.body.find(blog => blog.id==="5a422b891b54a676234d17fa")
    expect(updatedBlog.likes).toEqual(131)
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })

afterAll(async () => {
  await mongoose.connection.close()
})