import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('Blog component tests', () => {
  test('renders title and author, but does not render URL or likes by default', () => {
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

    const { container } = render(<Blog blog={blog} currentUser={{ username: 'testuser' }} />)

    screen.debug()

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('Test Blog Title')
    expect(div).toHaveTextContent('Test Author')

    const div2 = container.querySelector('.blogTogglable')
    expect(div2).toHaveStyle('display: none')
  })
})
