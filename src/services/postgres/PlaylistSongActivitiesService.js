const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool()
  }

  async addPlaylistSongActivities({ playlistId, songId, userId, action }) {
    const id = `playlistSongActivities-${nanoid(16)}`
    const createdAt = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, createdAt],
    }

    const result = await this._pool.query(query)

    console.log(result.rows)
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist Song Activities gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getPlaylistSongActivities(id) {
    const query = {
      text: `SELECT
            playlist_song_activities.action,
            playlist_song_activities.time,
            users.username,
            songs.title
          FROM
            playlist_song_activities
            JOIN playlists ON playlists.id = playlist_song_activities.playlist_id
            JOIN songs ON songs.id = playlist_song_activities.song_id
            JOIN users ON users.id = playlist_song_activities.user_id
          WHERE
            playlists.id = $1
          ORDER BY
            playlist_song_activities.time`,
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan')
    }

    return result.rows.map((item) => item)
  }
}

module.exports = PlaylistSongActivitiesService
