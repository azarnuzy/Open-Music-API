const Joi = require('joi')

const PlaylistSongsSchema = Joi.object({
  songId: Joi.string().required(),
})

module.exports = { PlaylistSongsSchema }
