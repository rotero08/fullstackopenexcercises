const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
  })
})
