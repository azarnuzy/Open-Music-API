const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumLikesService {
  constructor() {
    this._pool = new Pool()
  }

  async addAlbumLike({ userId, albumId }) {
    const id = `albumLike-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal disukai')
    }

    return result.rows[0].id
  }

  async getTotalAlbumLikes(id) {
    const query = {
      text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)
    // console.log(result.rows)
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan')
    }

    return result.rows[0]
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError(
        'Album gagal untuk tidak disukai. Id tidak ditemukan'
      )
    }
  }

  async verifyIsAlbumLikes(userId, albumId) {
    const query = {
      text: `SELECT *
        FROM user_album_likes
        WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    }

    const result = await this._pool.query(query)

    if (result.rows.length) {
      throw new InvariantError('Album gagal untuk disukai.')
    }
  }

  async verifyIsAlbumUnlikes(userId, albumId) {
    const query = {
      text: `SELECT *
        FROM user_album_likes
        WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new InvariantError('Album gagal untuk disukai.')
    }
  }
}

module.exports = AlbumLikesService
