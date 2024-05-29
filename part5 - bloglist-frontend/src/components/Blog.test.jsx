import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component tests', () => {
  let container
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  beforeEach(() => {
    container = render(<Blog blog={blog} currentUser={{ username: 'testuser' }} />).container
  })

  test('renders title and author, but does not render URL or likes by default', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Test Blog Title')
    expect(div).toHaveTextContent('Test Author')

    const div2 = container.querySelector('.blogTogglable')
    expect(div2).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.blogTogglable')
    expect(div).not.toHaveStyle('display: none')
  })
})
