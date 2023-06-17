const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan')
    }

    return result.rows[0].id
  }
}

module.exports = PlaylistsService