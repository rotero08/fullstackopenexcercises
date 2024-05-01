import { useState } from 'react'

const Blog = ({ newLikes, blog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = () => {
    newLikes(
      blog.id,
      {likes: blog.likes + 1})
  }

  return (
    <div className='blog'>
      {blog.title} {blog.author} <button style={hideWhenVisible} onClick={toggleVisibility}>view</button>
      <button style={showWhenVisible} onClick={toggleVisibility}>hide</button>
      <div style={showWhenVisible}>
        <div> {blog.url} </div>
        <div> 
          likes: {blog.likes} <button style={showWhenVisible} onClick={updateLikes}>like</button>
        </div>
        <div> {blog.user.name} </div>
      </div>
    </div>
  )  
}

export default Blog