const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
// const { mapDBToModel } = require('../../utils/playlistSongsIndex')

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylistSongs({ playlistId, songId }) {
    const id = `playlistSongs-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }

    // console.log(playlistId, songId)
    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Songs gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getSongsByPlaylistId(id) {
    const query = {
      text: 'SELECT s.id, s.title, s.performer FROM playlist_songs p JOIN songs s ON p.song_id=s.id WHERE p.playlist_id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows.map((item) => item)
  }
}

module.exports = PlaylistSongsService
