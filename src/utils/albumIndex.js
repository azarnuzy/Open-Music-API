// eslint-disable-next-line camelcase, object-curly-newline
const mapDBToModel = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
})

module.exports = { mapDBToModel }
