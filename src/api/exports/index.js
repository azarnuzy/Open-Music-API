const ExportsSongsPlaylist = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'exportsSongsPlaylist',
  version: '1.0.0',
  register: async (server, { exportsService, playlistsService, validator }) => {
    const exportsHandler = new ExportsSongsPlaylist(
      exportsService,
      playlistsService,
      validator
    )

    server.route(routes(exportsHandler))
  },
}
