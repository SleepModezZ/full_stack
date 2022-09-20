import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Testing displaying a blog', () => {
  test('Shows title and author but not likes and url', () => {
    const blog =   {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 123,
      user: 'dummy'
    }
    const user = 'dummy'
    let blogs = []

    render(<Blog blog={blog} user={user} blogs={blogs} />)

    // Tarkistetaan, että title ja author näkyvät sivulla:
    const title = screen.getByText(/Type wars/)
    expect(title).toBeVisible()
    const author = screen.getByText(/Robert C. Martin/)
    expect(author).toBeVisible()

    // Tarkistetaan, että liket ja url eivät näyt sivulla:
    const likes = screen.getByText(/123/)
    expect(likes).not.toBeVisible()
    const url = screen.getByText(/blog.cleancoder.com/)
    expect(url).not.toBeVisible()
  })


  test('Shows also likes and url after viewButton has been pressed', async () => {
    const blog =   {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 123,
      user: 'dummy'
    }
    const user = 'dummy'
    let blogs = []

    render(<Blog blog={blog} user={user} blogs={blogs} />)

    // Painetaan 'view'-nappia:
    const testUser = userEvent.setup()
    const button = screen.getByText('view')
    await testUser.click(button)

    // Tarkistetaan, että liket ja url näkyvät nyt sivulla:
    const likes = screen.getByText(/123/)
    expect(likes).toBeVisible()
    const url = screen.getByText(/blog.cleancoder.com/)
    expect(url).toBeVisible()
  })

  // En pitänyt tämän testin kirjoittamisesta, koska sen toteuttaminen vaati testattavan
  // koodin muokkaamista vain tätä testiä varten - eikä siis mitenkään paremmaksi.
  test('Pressin like-button twice the eventhandler is called twice', async () => {
    const blog =   {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 123,
      user: 'dummy'
    }
    const user = 'dummy'

    const testUser = userEvent.setup()
    const testFunction = jest.fn()

    render(<Blog blog={blog} user={user} testFunction={testFunction}/>)
    //screen.debug()

    // Painetaan 'view'-nappia:

    const viewButton = screen.getByText('view')
    await testUser.click(viewButton)

    const likeButton = screen.getByText('like')
    await testUser.click(likeButton)
    await testUser.click(likeButton)

    // Tarkistetaan, että testfunktiota kutsuttiin kahdesti.
    expect(testFunction.mock.calls).toHaveLength(2)

  })
})
