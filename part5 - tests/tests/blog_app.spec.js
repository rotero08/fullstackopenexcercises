const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, loginAndCreateBlogs } = require('./helper')
const { log } = require('console')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')
      await expect(page.getByText('wrong credentials')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
  
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'titletest', 'authortest', 'urltest')
      await expect(page.getByText('Blog titletest was successfully added')).toBeVisible()
      await expect(page.getByText('titletest')).toBeVisible()
      await expect(page.getByText('authortest')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('urltest')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'titletest', 'authortest', 'urltest')
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
    })

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'titletest', 'authortest', 'urltest')
      await page.getByRole('button', { name: 'view' }).click()
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click()
    })
  })

  describe('When multiple users have blogs', () => {
    beforeEach(async ({ request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          "name": "Jane Doe",
          "username": "janedoe",
          "password": "supersecret"
        }
      })
    })

    test('a blog can only be deleted by user who created it', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await createBlog(page, 'titletest', 'authortest', 'urltest')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'janedoe', 'supersecret')
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('all blogs are arranged in the order according to the likes', async ({ page }) => {
      await loginAndCreateBlogs('mluukkai', 'salainen');
      await loginAndCreateBlogs('janedoe', 'supersecret');
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await page.waitForTimeout(2000);

      // Get all "view" buttons and click them to reveal likes
      const viewButtons = await page.getByRole('button', { name: 'view' }).all()
      for (let i=viewButtons.length-1; i>=0; i--) {
        await viewButtons[i].click({force: true})
      }
    
      // Get all likes after revealing them
      const likeElements = await page.getByText('likes:').all();
      const blogLikes = [];
      for (let i=0; i<likeElements.length; i++) {
        const likeText = await likeElements[i].innerText();
        const likeNumber = parseInt(likeText.replace('likes: ', ''));
        blogLikes.push(likeNumber);
      }

      console.log('Blog likes:', blogLikes);
      const isSorted = blogLikes.every((like, index, array) => index === 0 || array[index - 1] >= like);
      console.log(isSorted);
      expect(isSorted).toBe(true);
    });
  })
})
