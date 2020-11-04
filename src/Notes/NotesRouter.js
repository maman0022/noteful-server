const express = require('express')
const NotesService = require('./NotesService')
const xss = require('xss')

function sanitizeNote(note) {
  return {
    id: note.id,
    name: xss(note.name),
    modified: note.modified,
    content: xss(note.content),
    folderid: note.folderid
  }
}

const NotesRouter = express.Router()

NotesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        const sanitizedNotes = notes.map(sanitizeNote)
        res.status(200).json(sanitizedNotes)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const { name, modified, content, folderid } = req.body
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: { message: 'name must be provided and cannot be empty' } })
    }
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: { message: 'content must be provided and cannot be empty' } })
    }
    if (!folderid || typeof folderid !== 'number') {
      return res.status(400).json({ error: { message: 'folder id must be provided and must be a number' } })
    }
    const noteData = { name, modified, content, folderid }
    NotesService.addNote(req.app.get('db'), noteData)
      .then(note => res.status(201).json(sanitizeNote(note)))
      .catch(next)
  })

NotesRouter
  .route('/:id')
  .all((req, res, next) => {
    NotesService.getNote(req.app.get('db'), req.params.id)
      .then(note => {
        if (!note) {
          return res.status(404).json({ error: { message: 'invalid note id' } })
        }
        res.note = sanitizeNote(note)
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.status(200).json(sanitizeNote(res.note))
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get('db'), req.params.id)
      .then(() => res.status(204).end())
      .catch(next)
  })

module.exports = NotesRouter