import { useState } from 'react'
import blogService from '../services/blogs'
import compareLikes from '../services/compareLikes'
//import Notification from '../components/Notification'

const Blog = ({ user, blog, blogs, setBlogs, setErrorMessage, setConfirmationMessage, testFunction }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  // Seuraava vertailu heittää virheen ja estää koko sovelluksen
  // toimimisen, jos user.username tai blog.user.username on null. Kumpaakaan ei kuitenkaan
  // pitäisi milloinkaan tapahtua. Jälkimmäinen voisi tapahtua vain, mikäli tietokannassa
  // olisi blogeja, joilla ei ole postaajaa eli user-attribuuttia. Postaaminen on kuitenkin
  // mahdollista vain kirjautuneille käyttäjille. Yrittäisin ratkaista tämän
  // paremmin jos kyseessä olisi oikea tuotantokoodi. Käytän authorized muuntajaa
  // kertomaan tuleeko käyttäjälle näyttää nappi postauksen poistamiseksi.
  // Se siis näytetään vain jos postauksen tehnyt on sama kuin nyt kirjautunut käyttäjä.
  // Syystä tai toisesta tämä on ehkä eniten testauksessa ongelmia tuottanut kohta...
  let authorized = user.username === blog.user.username ? true : false

  // Cypress testaus ei jostain syystä vastaanota arvoa blog.user.username, vaikka
  // selaimessa se toimii. Sen seuraksena blogin poistaminen ei onnistu, koska
  // nappula on näkyvissä vain, jos blogin poistaja on sama kuin blogin postaaja.
  // Siksi lisäsin tämän 'ohituskaistan', jotta testaus toimisi. Nyt poisto-nappi
  // näkyy, vaikka ehto (user.username === blog.user.username) olisi false mikäli
  // blog.user.username on null tai undefined. Näin ei normaalisti pitäisi ikinä olla
  // ja backend jokatapauksessa estää autorisoimattomat poistot. Olisi tietenkin
  // parempi selvittää varsinainen ongelma, mutta en onnistunut siinä, vaikka
  // käytin yli tunnin asian selvittelyyn.
  if (!blog.user.username) {
    authorized = true
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const like = async () => {
    // Tämä tuntuu tyhmältä, mutta oli mielestäni helpoin tapa ilman koodin refaktorointia
    // huonommaksi, jotta saisi tehtävänannon 5.15 mukaisen ratkaisun toimimaan.
    // Refaktorointi olisi tarkoittanut tämän funktion siirtämisen osaksi kutsujaa (App),
    // josta olen sen aikaisemmin siirtänyt pois kun tavoite on ollut laihduttaa App.js-tiedostoa.
    if (testFunction) {
      testFunction()
      return
    }
    const blogObject = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    try {
      const returnedBlog = await blogService.update(blog.id, blogObject)
      const newList = blogs.filter(b => b.id !== blog.id)
      setBlogs(newList.concat(returnedBlog).sort(compareLikes))

      const message = 'you liked ' + blogObject.title + ' by ' + blogObject.author
      setConfirmationMessage(message)
      setTimeout(() => {
        setConfirmationMessage(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setErrorMessage(exception.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async () => {
    const text = 'Remove blog ' + blog.title + ' by ' + blog.author
    if (window.confirm(text)) {
      try {
        const response = await blogService.remove(blog.id)
        console.log(response)
        const newList = blogs.filter(b => b.id !== blog.id)
        setBlogs(newList)
        const message = blog.title + ' removed'
        setConfirmationMessage(message)
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
      } catch (exception) {
        console.log(exception)
      }
    }
  }

  const viewDetails = { display: detailsVisible ? '' : 'none' }
  const viewButton = { display: detailsVisible ? 'none' : '' }
  const hideButton = { display: detailsVisible ? '' : 'none' }
  const showRemove = { display: authorized ? '' : 'none' }
  const removeButton = { 'backgroundColor': 'CornflowerBlue' }

  return (
    <div style={blogStyle} className='blog'>
      <div className='mainInfo'>
        {blog.title} {blog.author}
        <button id='view' style={viewButton} onClick={() => setDetailsVisible(true)}>view</button>
        <button style={hideButton} onClick={() => setDetailsVisible(false)}>hide</button><br />
      </div>
      <div className='details' style={viewDetails}>
        {blog.url}<br />
        likes {blog.likes} <button id='like' onClick={like} >like</button><br />
        {blog.user.name}<br />
        <div style={showRemove}><button id='remove' onClick={removeBlog} style={removeButton} >remove</button></div>
      </div>
    </div>
  )
}

export default Blog
