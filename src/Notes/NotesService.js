module.exports = {
  getAllNotes(db) {
    return db('notes')
  },
  getNote(db, id) {
    return db('notes').where({ id }).first()
  },
  deleteNote(db, id) {
    return db('notes').delete().where({ id })
  },
  addNote(db, noteData) {
    return db('notes').insert(noteData).returning('*').then(rows => rows[0])
  }
}