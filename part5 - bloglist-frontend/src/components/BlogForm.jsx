import { useState } from 'react'

const BlogForm = ({createBlog}) => {
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
        <form onSubmit={addBlog}>
            <div>
                Title: <input value={newTitle} onChange={handleTitleChange} />
            </div>
            <div>
                Author: <input value={newAuthor} onChange={handleAuthorChange} />
            </div>
            <div>
                Url: <input value={newUrl} onChange={handleUrlChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default BlogForm