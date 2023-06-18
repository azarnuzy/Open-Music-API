const InvariantError = require('../../exceptions/InvariantError')
const { PlaylistSongsSchema } = require('./schema')

const PlaylistSongsValidator = {
  validatePlaylistSongsPayload: (payload) => {
    // console.log(payload)
    const validationResult = PlaylistSongsSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = PlaylistSongsValidator
