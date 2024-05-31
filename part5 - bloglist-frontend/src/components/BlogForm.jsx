import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle ] = useState('')
  const [newAuthor, setNewAuthor ] = useState('')
  const [newUrl, setNewUrl ] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  return(
    <form className='form' onSubmit={addBlog}>
      <div>
          Title: <input data-testid='title' value={newTitle} onChange={handleTitleChange} placeholder='Title' />
      </div>
      <div>
          Author: <input data-testid='author' value={newAuthor} onChange={handleAuthorChange} placeholder='Author' />
      </div>
      <div>
          Url: <input data-testid='url' value={newUrl} onChange={handleUrlChange} placeholder='Url' />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default BlogForm
