const mongoose = require('mongoose')
const helper = require("./test_helper")
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')

let headers

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    
})

beforeEach(async () => {
  await User.deleteMany({});
  const newUser = {
    username: 'root',
    name: 'root',
    password: 'password',
  }

  await api
    .post('/api/users')
    .send(newUser)

  const result = await api
    .post('/api/login')
    .send(newUser)

  headers = {
    'Authorization': `Bearer ${result.body.token}`
  }
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .set(headers)
    .expect('Content-Type', /application\/json/)
})

test('blogs unique identifier is named id', async () => {
    const response = await api
      .get('/api/blogs')
      .set(headers)
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
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set(headers)
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
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api
      .get('/api/blogs')
      .set(headers)

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
        .set(headers)
        .send(newBlog)
        .expect(400)
})

test('adding a blog fails with 401 Unauthorized if token is not provided', async () => {
  const newBlog = {
      title: "Unauthorized Access Blog",
      author: "Anonymous",
      url: "http://example.com/unauthorized-access",
      likes: 0
  };

  // Attempt to create a blog without providing an authorization token
  await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)  // Expecting HTTP 401 Unauthorized response
      .expect('Content-Type', /application\/json/);
});

test('blogs are deleted successfully', async () => {
  // Assuming you already have a valid token and the necessary headers setup
  const newBlog = {
      title: "Temporary Blog",
      author: "Test Author",
      url: "http://example.com/temp-blog",
      likes: 1
  };

  // Create a new blog
  const createdBlogResponse = await api
      .post('/api/blogs')
      .set(headers)  // make sure token is defined in your scope
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  // Extract the ID of the newly created blog
  const { id } = createdBlogResponse.body;

  // Delete the blog using the ID
  await api
      .delete(`/api/blogs/${id}`)
      .set(headers)  // Authorization header for secure endpoint
      .expect(204);

  // Optionally verify that the blog no longer exists
  const finalBlogsResponse = await api
    .get('/api/blogs')
    .set(headers)
  const blogs = finalBlogsResponse.body;
  const blogExists = blogs.some(blog => blog.id === id);
  expect(blogExists).toBe(false);
});


test('blogs are updated successfully', async () => {
    const updateBlog = {
        likes: 131,
    }

    await api
        .put('/api/blogs/5a422b891b54a676234d17fa')
        .set(headers)
        .send(updateBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const response = await api
      .get('/api/blogs')
      .set(headers)

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

    test('creation fails with proper status code and message if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb()
      const newUser = {
        username: 'root', // Already existing
        name: 'Test User',
        password: 'testpassword'
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body.error).toContain('expected `username` to be unique')
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toEqual(usersAtStart)
    })

    test('creation fails with proper status code and message if username is less than 3 characters', async () => {
      const newUser = {
        username: 'ab', // Less than 3 characters
        name: 'Short Name',
        password: 'testpassword'
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('is shorter than the minimum allowed length (3)');
    });

    test('creation fails with proper status code and message if password is less than 3 characters', async () => {
      const newUser = {
        username: 'newuser',
        name: 'New User',
        password: 'pw' // Less than 3 characters
      };
  
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);
  
      expect(result.body.error).toContain('Password must be at least 3 characters long');
    });
  })

afterAll(async () => {
  await mongoose.connection.close()
})