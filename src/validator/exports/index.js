const InvariantError = require('../../exceptions/InvariantError')
const ExportSongsPlaylistPayloadSchema = require('./schema')

const ExportSongsPlaylistValidator = {
  validateExportSongsPlaylistPayload: (payload) => {
    const validationResult = ExportSongsPlaylistPayloadSchema.validate(payload)

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = ExportSongsPlaylistValidator
