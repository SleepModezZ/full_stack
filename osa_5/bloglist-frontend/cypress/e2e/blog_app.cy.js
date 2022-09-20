describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testaaja',
      username: 'testaaja',
      password: 'salaisuus'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testaaja')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()
      cy.contains('Testaaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('testaaja')
      cy.get('#password').type('huijaa')
      cy.get('#login-button').click()
      cy.get('.error').contains('wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
      cy.contains('log in to application')
    })
  })


  describe('when logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('testaaja')
      cy.get('#password').type('salaisuus')
      cy.get('#login-button').click()
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Cypress is a Javascript End to End testing framework')
      cy.get('#author').type('Anon.')
      cy.get('#url').type('cypress.io/blog')
      cy.get('#create').click()
      cy.get('.confirmation').contains('a new blog Cypress is a Javascript End to End testing framework by Anon. added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains('Cypress is a Javascript End to End testing framework Anon.')
    })

    it('a blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Cypress is a Javascript End to End testing framework')
      cy.get('#author').type('Anon.')
      cy.get('#url').type('cypress.io/blog')
      cy.get('#create').click()
      cy.get('#view').click()
      cy.contains('likes 0')
      cy.get('#like').click()
      cy.contains('likes 1')
    })

    it('a blog can be removed', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Cypress is a Javascript End to End testing framework')
      cy.get('#author').type('Anon.')
      cy.get('#url').type('cypress.io/blog')
      cy.get('#create').click()
      cy.get('#view').click()
      cy.get('#remove').click()
      cy.on('window:confirm', () => true)
      cy.get('.confirmation').contains('Cypress is a Javascript End to End testing framework removed')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
      // Blogiolistan tulisi olla nyt tyhjä.
      cy.get('.blog').should('not.exist')
      // Tarkistan poistamisen onnistumisen vielä sillä, että blogin authoria
      // ei enää löydy sivulta. En käytä tässä blogin nimeä, koska se näkyy
      // onnistuneen poiston tuottamassa notifikaatiossa. En voi myöskään rajoittaa
      // tarkistusta vain .blog luokkaan, koska tulostuksessa ei ole tällä
      //hetkellä yhtään blogia.
      cy.contains('Anon.').should('not.exist')
      //
    })

    it('blogs are ordered by likes', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('First')
      cy.get('#author').type('Anon.')
      cy.get('#url').type('cypress.io/blog')
      cy.get('#create').click()
      cy.contains('new blog').click()
      cy.get('#title').type('Second')
      cy.get('#author').type('Anon.')
      cy.get('#url').type('cypress.io/blog')
      cy.get('#create').click()
      // Haluan aluksi tarkistaa, että elementit ovat niillä paikoilla, joilla
      // oletan niiden olevan listassa siinä vaiheessa kun molemmilla on 0 tykkäystä:
      cy.get('.blog').eq(0).contains('First')
      // Lisäsin tarkistuksen, että title löytyy sivulta, koska se ilmeisesti
      // odottaa sivun päivittymistä. Ilman sitä joutuisin kutsumaan cy.wait()
      // funktiota viivyttämään cy.get('.blog').eq(1)-kutsua. Muuten se antaa virheen.
      cy.contains('Second')
      cy.get('.blog').eq(1).contains('Second')
      // painetaan Secondin viewiä ja likeä:
      cy.get('.blog').eq(1).find('#view').click()
      cy.get('.blog').eq(1).find('#like').click()
      // Ja tarkistetaan, että se on nyt ensimmäisenä listalla, mutta contains-kutsu
      // viivyttää tarkistusta, jotta se menee lävitse:
      cy.contains('likes 1')
      cy.get('.blog').eq(0).should('contain', 'Second')

      // Ehkä ylläoleva riittäisi, mutta tarkistan vielä varmuuden vuoksi,
      // että nyt toisena sijaitseva 'First' nousee ensimmäiseksi, kun sitä
      // tykätään kahdesti:
      cy.get('.blog').eq(1).find('#view').click()
      cy.get('.blog').eq(1).find('#like').click()
      // Ehkä periaatteessa tässä vaiheessa elementtienb järjestys voisi vaihtua.
      // koska molemmilla on yksi tykkäys. Käytönnössä niin ei kuitenkaan tapahdu,
      // vaan molemmat klikkaukset kohdistuvat samaan nappiin kuten on tarkoituskin.
      // Ehkä olisi parempi muokata koodi varmistamaan, että nämä perättäiset
      // klikkaukset kohdistuvat samaan nappulaan, mutta tämä saa nyt kelvata
      // (olen mielesetäni jo käyttänyt riittävästi aikaa tämän osion tehtäviin).
      // Toisella koneella mielestäni onnistui laittaa toinen klikkaus heti ensimmäisen
      // perään, mutta toisella koneella toinen klikkaus ei rekisteröitynyt. Siksi
      // lisäsi tähän tarkistuksen, että ensimmäinen klikkaus on mennyt perille ennen
      // seuraavaa klikkausta:
      cy.get('.blog').eq(1).contains('likes 1')
      cy.get('.blog').eq(1).find('#like').click()
      // Viivytyksenä:
      cy.contains('likes 2')
      // Ja viimein tarkistus, että järjstys on vaihtunut:
      cy.get('.blog').eq(0).should('contain', 'First')
    })
  })
})
