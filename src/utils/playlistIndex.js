// eslint-disable-next-line camelcase
const mapDBToModel = ({ id, name, created_at, updated_at, username }) => ({
  id,
  name,
  createdAt: created_at,
  updatedAt: updated_at,
  username,
})

module.exports = { mapDBToModel }
