import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title')
  const authorInput = screen.getByPlaceholderText('Author')
  const urlInput = screen.getByPlaceholderText('Url')
  const sendButton = screen.getByText('add')

  await user.type(titleInput, 'testing a title...')
  await user.type(authorInput, 'testing an author...')
  await user.type(urlInput, 'testing an url...')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  console.log(createBlog.mock.calls)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a title...')
  expect(createBlog.mock.calls[0][0].author).toBe('testing an author...')
  expect(createBlog.mock.calls[0][0].url).toBe('testing an url...')
})
