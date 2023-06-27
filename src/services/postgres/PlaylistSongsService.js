const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')
// const { mapDBToModel } = require('../../utils/playlistSongsIndex')

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
  }

  async addPlaylistSongs({ playlistId, songId }) {
    const id = `playlistSongs-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Songs gagal ditambahkan')
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`)

    return result.rows[0].id
  }

  async getSongsByPlaylistId(id) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${id}`)
      return JSON.parse(result)
    } catch (error) {
      const query = {
        text: 'SELECT s.id, s.title, s.performer FROM playlist_songs p JOIN songs s ON p.song_id=s.id WHERE p.playlist_id = $1',
        values: [id],
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) {
        throw new NotFoundError('Playlist tidak ditemukan')
      }

      await this._cacheService.set(
        `playlistSongs:${id}`,
        JSON.stringify(result.rows)
      )

      return result.rows
    }
  }

  async deletePlaylistSongs(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $2 AND song_id = $1 RETURNING id',
      values: [songId, playlistId],
    }
    // DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2
    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Playlist Song gagal dihapus')
    }

    await this._cacheService.delete(`playlistSongs:${playlistId}`)
  }
}

module.exports = PlaylistSongsService
