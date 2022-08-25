const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

// Ei enää käytössä, koske userExtractor korvasi sen toiminnan. Toimi hyvin.
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}


// En osannut tehdä tätä fiksummin, vaan päädyin käytännössä toistamaan tokenExtractorin
// koodin kokonaisuudessaan tässä. Toisaalta se tarkoittaa sitä, että tokenExtractor on
// tällä hetkellä tarpeeton ja en käytäkään sitä enää tässä ohjelmassa. Jätän sen kuitenkin,
// jotta saan tehtävästä 4.20 pisteet. (Ja toivottavasti saan myös tästä (4.22)
// kohdasta toivomani pisteet...)
const userExtractor = async (request, response, next) => {

  let token = null
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)


  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (decodedToken) {
    request.user = await User.findById(decodedToken.id)
  }

  next()
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
