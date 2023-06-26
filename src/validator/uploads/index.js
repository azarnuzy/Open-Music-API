const InvariantError = require('../../exceptions/InvariantError')
const ImageHeadersSchema = require('./shcema')

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers)
    // console.log(validationResult.error)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },
}

module.exports = UploadsValidator
