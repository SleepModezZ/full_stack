const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {

  if (blogs.length === 0) {
    return {}
  }

  const favorite = blogs.reduce((prev, blog) => blog.likes > prev.likes ? blog : prev, blogs[0])

  const { _id, url, __v, ...result } = favorite //linteri herjaa, en välitä
  return result
}


const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return {}
  }

  // Jos sanakirja (eli jv:n olio) olisi Haskellin tavoin muuttumaton (ja sen
  // "muuttamiseen" käytettävä funktio palauttaisi uuden sanakirjan), reducen käyttäminen tässä olisi
  // luontevaa ja perusteltua. TIetenkin olion voi kopioida jokaisen reducen jokaisella
  // askeleella, mutta olion kopiominen ja sen attribuuttien muuttaminen tekee käytettävästä
  // funktiosta jo sen verran monimutkaisen, että reducen käyttö ei ole mielestäni perusteltua.
  // Sama koskee myös vastaavaa looppia seuraavassa funktiossa.
  const table = {}
  for (let blog of blogs) {
    if (blog.author in table) {
      table[blog.author] += 1
    } else {
      table[blog.author] = 1
    }
  }

  // Samoin seuraava looppi lienee mahdollinen korvata reducea käyttämällä
  // (Object.keys(table).reduce()), mutta epäilen olisiko lopputulos kovinkaan luettava,
  // joten en edes yritä.
  let result = {}
  let max = 0
  for (let author in table) {
    if (table[author] > max) {
      max = table[author]
      result = { 'author': author, 'blogs': table[author] }
    }
  }

  return result
}


const mostLikes = (blogs) => {

  if (blogs.length === 0) {
    return {}
  }

  const table = {}

  for (let blog of blogs) {
    if (blog.author in table) {
      table[blog.author] += blog.likes
    } else {
      table[blog.author] = blog.likes
    }
  }


  let result = {}
  let max = -1
  for (let author in table) {
    if (table[author] > max) {
      max = table[author]
      result = { 'author': author, 'likes': table[author] }
    }
  }

  return result
}



module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
