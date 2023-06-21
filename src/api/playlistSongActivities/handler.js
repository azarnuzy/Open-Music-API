const autoBind = require('auto-bind')

class PlaylistSongActivitiesHandler {
  constructor(playlistSongActivities, playlistsService) {
    this._playlistSongActivities = playlistSongActivities
    this._playlistsService = playlistsService

    autoBind(this)
  }

  async getPlaylistSongActivitiesHandler(request, h) {
    const { id } = request.params

    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    const playlistSongActivities =
      await this._playlistSongActivities.getPlaylistSongActivities(id)

    const response = h.response({
      status: 'success',
      data: {
        playlistId: id,
        activities: playlistSongActivities,
      },
    })

    response.code(200)

    return response
  }
}

module.exports = PlaylistSongActivitiesHandler
