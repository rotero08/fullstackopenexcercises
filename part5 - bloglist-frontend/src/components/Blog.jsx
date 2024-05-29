import { useState } from 'react'

const Blog = ({ newLikes, delBlog, blog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenBlogUserIsCurrentUser = { display: blog.user.username === currentUser.username ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = () => {
    newLikes(
      blog.id,
      { likes: blog.likes + 1 })
  }

  const deleteBlog = () => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
      delBlog(blog.id)
    }
  }

  return (
    <div className='blog'>
      {blog.title} {blog.author} <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div className='blogTogglable' style={showWhenVisible}>
        <div> {blog.url} </div>
        <div>
          likes: {blog.likes} <button style={showWhenVisible} onClick={updateLikes}>like</button>
        </div>
        <div> {blog.user.name} </div>
        <div>
          <button style={showWhenBlogUserIsCurrentUser} onClick={deleteBlog}>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
