const { Pool } = require('pg')
const { nanoid } = require('nanoid')

class AlbumService {
  constructor() {
    this._pool = new Pool()
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
  }
}
