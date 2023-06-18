const autoBind = require('auto-bind')

class PlaylistSongsHandler {
  constructor(playlistSongsService, playlistsService, songsService, validator) {
    this._playlistSongsService = playlistSongsService
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistSongsHandler(request, h) {
    this._validator.validatePlaylistSongsPayload(request.payload)

    const { id: credentialId } = request.auth.credentials
    const { id } = request.params
    const { songId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    await this._songsService.getSongById(songId)

    const playlistSongsId = await this._playlistSongsService.addPlaylistSongs({
      playlistId: id,
      songId,
    })

    const response = h.response({
      status: 'success',
      message: 'Menambahkan lagu ke playlist',
      data: {
        playlistSongsId,
      },
    })

    response.code(201)
    return response
  }

  async getPlaylistSongsHandler(request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    const songs = await this._playlistSongsService.getSongsByPlaylistId(id)

    let playlist = await this._playlistsService.getPlaylistById(id)

    playlist = {
      ...playlist,
      songs,
    }

    const response = h.response({
      status: 'success',
      data: {
        playlist,
      },
    })

    response.code(200)
    // console.log(response)
    return response
  }
}

module.exports = PlaylistSongsHandler
