import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// Nimesin tämän aluksi 'get', mutta kun editorin syntaksivärjäys
// väritti sen toisella värillä kuin muut muuttujat päätin tarkistaa,
// onko kyseessä Javascriptin avainsana - ja onhan se. Siitä huolimatta
// ohjelma toimi, mutta päätin kuitenkin muuttaa muuttujan nimen:
const getOne = async (id) => {
  const response = await axios.get(baseUrl + '/' + id)
  return response.data
}

const createNew = async (content) => {
  const object = { content, votes: 0 }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (object) => {
  const id = object.id
  const response = await axios.put(baseUrl + '/' + id, object)
  return response.data
}

export default { getOne, getAll, createNew, update }
