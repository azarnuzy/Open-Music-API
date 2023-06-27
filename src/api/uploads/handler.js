const autoBind = require('auto-bind')

class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService
    this._albumsService = albumsService
    this._validator = validator

    autoBind(this)
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload
    // console.log(request.payload)
    const { id } = request.params
    this._validator.validateImageHeaders(cover.hapi.headers)

    const filename = await this._storageService.writeFile(cover, cover.hapi)

    await this._albumsService.editAlbumCoverById(
      id,
      `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`
    )

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    })

    response.code(201)
    return response
  }
}

module.exports = UploadsHandler
