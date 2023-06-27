const autoBind = require('auto-bind')

class AlbumLikesHandler {
  constructor(albumLikesService, albumsService) {
    this._albumLikesService = albumLikesService
    this._albumsService = albumsService

    autoBind(this)
  }

  async postAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id } = request.params

    await this._albumsService.verifyAlbumById(id)
    await this._albumLikesService.verifyIsAlbumLikes(credentialId, id)
    const albumId = await this._albumLikesService.addAlbumLike({
      userId: credentialId,
      albumId: id,
    })

    const response = h.response({
      status: 'success',
      message: 'Menyukai album berhasil',
      data: {
        albumId,
      },
    })

    response.code(201)
    return response
  }

  async getAlbumLikesHandler(request, h) {
    const { id } = request.params

    const likes = await this._albumLikesService.getTotalAlbumLikes(id)
    const response = h.response({
      status: 'success',
      data: {
        likes: Number(likes.data.likes),
      },
    })

    if (likes.isCache) {
      response.header('X-Data-Source', 'cache')
    }
    response.code(200)
    return response
  }

  async deleteAlbumLikesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials
    const { id } = request.params

    await this._albumLikesService.verifyIsAlbumUnlikes(credentialId, id)
    await this._albumLikesService.deleteAlbumLike(id, credentialId)

    const response = h.response({
      status: 'success',
      message: 'Batal menyukai album berhasil',
    })
    response.code(200)
    return response
  }
}

module.exports = AlbumLikesHandler
