import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Togglable from './components/Toggable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      getBlogs()
    }
  }, [])

  const getBlogs = async () => {
    const blogs = await blogService.getAll()
    setBlogs(blogs)
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
        await blogService
                .create(blogObject)
        setSuccessMessage(
        `Blog ${blogObject.title} was successfully added`
        )
        getBlogs()
        setErrorMessage(null)
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
    } catch(exception) {
        setErrorMessage(
        `Cannot add blog ${blogObject.title}`
        )
        setSuccessMessage(null)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }

  const updateLikes = async (id,blogObject) => {
    try {
      await blogService
              .update(id,blogObject)
      getBlogs()
      setErrorMessage(null)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
  } catch(exception) {
      setErrorMessage(
      `Cannot update blog likes`
      )
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
  }
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      getBlogs()
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const logoutEvent = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification errorMessage={errorMessage} successMessage={successMessage} />
        <LoginForm sendLogin={handleLogin}/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification errorMessage={errorMessage} successMessage={successMessage} />
      <p>{user.name} logged in <button onClick={logoutEvent}>logout</button> </p> 
      {blogs.toSorted((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} newLikes={updateLikes} blog={blog} /> 
      )}

      <h2>create new</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
    </div>
  )
}

export default App