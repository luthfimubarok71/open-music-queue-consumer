const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `
      SELECT
        p.id AS "playlistId",
        p.name AS "playlistName",
        s.id AS "songId",
        s.title AS "songTitle",
        s.performer
      FROM playlists p 
      LEFT JOIN playlist_songs ps ON ps.playlist_id = p.id
      LEFT JOIN songs s ON s.id= ps.song_id
      WHERE p.id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    const playlists = {};
    result.rows.forEach((row) => {
      if (!playlists[row.playlistId]) {
        playlists[row.playlistId] = {
          id: row.playlistId,
          name: row.playlistName,
          songs: [],
        };
      }
      playlists[row.playlistId].songs.push({
        id: row.songId,
        title: row.songTitle,
        performer: row.performer,
      });
    });

    return {
      playlist: Object.values(playlists)[0],
    };
  }
}

module.exports = PlaylistsService;