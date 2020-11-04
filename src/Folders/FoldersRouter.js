const express = require('express')
const FolderService = require('./FolderService')
const xss = require('xss')

function sanitizeFolder(folder) {
  return {
    id: folder.id,
    name: xss(folder.name)
  }
}

const FolderRouter = express.Router()

FolderRouter
  .route('/')
  .get((req, res, next) => {
    FolderService.getAllFolders(req.app.get('db'))
      .then(folders => {
        const sanitizedFolders = folders.map(sanitizeFolder)
        res.status(200).json(sanitizedFolders)
      })
      .catch(next)
  })
  .post((req, res, next) => {
    const { name } = req.body
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: { message: 'name must be a string and cannot be empty' } })
    }
    const folderData = { name }
    FolderService.addFolder(req.app.get('db'), folderData)
      .then(folder => res.status(201).json(sanitizeFolder(folder)))
      .catch(next)
  })

FolderRouter
  .route('/:id')
  .all((req, res, next) => {
    FolderService.getFolder(req.app.get('db'), req.params.id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({ error: { message: 'invalid folder id' } })
        }
        res.folder = sanitizeFolder(folder)
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.status(200).json(res.folder)
  })
  .delete((req, res, next) => {
    FolderService.deleteFolder(req.app.get('db'), req.params.id)
      .then(() => res.status(204).end())
      .catch(next)
  })


module.exports = FolderRouter