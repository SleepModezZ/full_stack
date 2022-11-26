import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

// Myös tämän testi toteuttaminen vaati joitakin testattavaan koodiin, joita en pidä sinänsä
// hyvänä koodina. Komponentti ei normaalisti saa postauksen lisäävää funktiota propsina,
// koska mielestäni se sijoittuu paremmin itse componenttiin eikä sen kutsujaan (App). Testausta
// varten postauksen luomiseen käytettävään funktioon oli lisättävä toiminnallisuus, joka
// tarkistaa, onko komponentti vastaanottanut testFunktion, ja jos on, kutsutaan sitä ja
// jätetään oikea toiminnallisuus väliin (se aiheuttaisikin vain virheen backendissä, koska
// kutsusta puuttuisi kirjautunut käyttäjä.)
describe('Testing creating a new blog entry', () => {
  test('A new blog is created with the correct content', async () => {
    const user = 'dummy'

    const title = 'On Testing'
    const author = 'Anonymous'
    const url = 'com.org.dev'

    const testUser = userEvent.setup()
    const testFunction = jest.fn()

    // Tunnistetaan elementit. (En halunnut lisätä testaamista varten omia id-tunnisteita,
    // vaan käyttää niitä, jotka mielestäni on muutenkin hyvä olla paikoillaan. Se onnistui
    // seuraavasta ohjeesta lainaamalla:
    // https://stackoverflow.com/questions/53003594/find-element-by-id-in-react-testing-library.)
    const result = render(<BlogForm user={user} testFunction={testFunction}/>)
    const titleField = result.container.querySelector('#title')
    const authorField = result.container.querySelector('#author')
    const urlField = result.container.querySelector('#url')
    const createButton = result.container.querySelector('#create')

    // Täytetään tiedot kenttiin:
    await testUser.type(titleField, title)
    await testUser.type(authorField, author)
    await testUser.type(urlField, url)

    // Painetaan 'create'-nappia:
    await testUser.click(createButton)

    // Tarkistetaan, että testfunktion kutsu sai oikeat tiedot sisältävän olion parametrinaan
    const blog = testFunction.mock.calls[0][0]
    expect(blog.title).toContain(title)
    expect(blog.author).toContain(author)
    expect(blog.url).toContain(url)
  })
})
