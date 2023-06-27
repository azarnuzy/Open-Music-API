const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')
const NotFoundError = require('../../exceptions/NotFoundError')

class AlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool()
    this._cacheService = cacheService
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

    await this._cacheService.delete(`albumLikes:${albumId}`)

    return result.rows[0].id
  }

  async getTotalAlbumLikes(id) {
    try {
      const result = await this._cacheService.get(`albumLikes:${id}`)
      return { data: JSON.parse(result), isCache: true }
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1',
        values: [id],
      }

      const result = await this._pool.query(query)

      if (!result.rows.length) {
        throw new NotFoundError('Album tidak ditemukan')
      }

      await this._cacheService.set(
        `albumLikes:${id}`,
        JSON.stringify(result.rows[0])
      )

      return { data: result.rows[0], isCache: false }
    }
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

    await this._cacheService.delete(`albumLikes:${albumId}`)
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
