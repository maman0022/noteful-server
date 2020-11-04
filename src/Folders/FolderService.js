module.exports = {
  getAllFolders(db){
    return db('folders')
  },
  getFolder(db,id){
    return db('folders').where({id}).first()
  },
  addFolder(db,folderData){
    return db('folders').insert(folderData).returning('*').then(rows=>rows[0])
  },
  deleteFolder(db,id){
    return db('folders').delete().where({id})
  }
}