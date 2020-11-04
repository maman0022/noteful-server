require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, API_TOKEN } = require('./config')
const NotesRouter = require('./Notes/NotesRouter')
const FoldersRouter = require('./Folders/FoldersRouter')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

function validateBearerToken(req, res, next) {
  const token = req.get('Authorization') || ''
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or Malformed Authorization Header' })
  }
  if (token.split(' ')[1] !== API_TOKEN) {
    return res.status(401).json({ message: 'Invalid Credentials' })
  }
  next()
}

function handleMainPage(req, res) {
  res.send('Hello, world!')
}

app.get('/', handleMainPage)

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(validateBearerToken)
app.use('/api/notes', NotesRouter)
app.use('/api/folders', FoldersRouter)

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = app