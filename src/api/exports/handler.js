const autoBind = require('auto-bind')

class ExportsSongsPlaylist {
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService
    this._playlistsService = playlistsService
    this._validator = validator

    autoBind(this)
  }

  async postExportSongsPlaylistHandler(request, h) {
    this._validator.validateExportSongsPlaylistPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { id } = request.params

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
      playlistId: id,
    }

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._exportsService.sendMessage(
      'exports:songsPlaylist',
      JSON.stringify(message)
    )

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    })

    response.code(201)
    return response
  }
}

module.exports = ExportsSongsPlaylist
