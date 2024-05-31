const { expect, request } = require('@playwright/test')

const loginWith = async (page, username, password)  => {
    await page.getByRole('textbox').first().fill(username)
    await page.getByRole('textbox').last().fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'add' }).click()
}

const loginAndCreateBlogs = async (username, password) => {
    // Create a new request context
    const context = await request.newContext();
    
    // Login and get the token
    const loginResponse = await context.post('http:localhost:3003/api/login', {
      data: {
        username: username,
        password: password
      }
    });
    
    const result = await loginResponse.json();
    const token = result.token;
    
    // Set headers with the token
    const headers = {
      'Authorization': `Bearer ${token}`
    };
  
    // Generate a random number of blogs between 1 and 5
    const numberOfBlogs = Math.floor(Math.random() * 5) + 1;
  
    for (let i = 0; i < numberOfBlogs; i++) {
      // Generate random title, author, and url
      const title = `Title ${Math.random().toString(36).substring(7)}`;
      const author = `Author ${Math.random().toString(36).substring(7)}`;
      const url = `https://example.com/${Math.random().toString(36).substring(7)}`;
      const likes = Math.floor(Math.random() * 500) + 1; // Random number of likes between 1 and 500
  
      const newBlog = {
        title: title,
        author: author,
        url: url,
        likes: likes
      };
  
      // Create a new blog with the generated data
      await context.post('http:localhost:3003/api/blogs', {
        data: newBlog,
        headers: headers
      });
    }
    
    // Close the request context
    await context.dispose();
  };

export { loginWith, createBlog, loginAndCreateBlogs }
